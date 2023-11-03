/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import Joi from "joi";
import * as logger from "firebase-functions/logger";

import { registerUser } from "../db/user";
import { BaseUser } from "../types/user";
import { HttpsFunctionHandler } from "../types";
import { AuthErrorCodes } from "firebase/auth";

const register: HttpsFunctionHandler = async (request, response) => {
  const { value: payload, error } = Joi.object<BaseUser>({
    name: Joi.string().min(3).max(30).required(),

    password: Joi.string()
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Z\d]{8,}$/),

    email: Joi.string().email({}).required(),

    type: Joi.string().valid("org", "volunteer").required(),
  }).validate(request.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    response.validationError(
      error.details.reduce((result, { message, path }) => {
        result[path[0]] = message;
        return result;
      }, {})
    );
    return;
  }

  logger.info("registering user", { payload });

  try {
    response.status(201).json(await registerUser(payload));
  } catch (err) {
    if (err?.code === AuthErrorCodes.EMAIL_EXISTS) {
      response.validationError({ email: "já existe um utilizador com esse email" });
      return;
    }

    logger.error("failed to register user", { payload, err });
    response.status(500).json({ reason: "Something went wrong on our side" });
    return;
  }
};

export default { register };
