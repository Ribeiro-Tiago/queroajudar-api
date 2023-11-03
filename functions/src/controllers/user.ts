/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from "firebase-functions/logger";
import Joi from "joi";

import { HttpsFunctionHandler } from "../types";

const register: HttpsFunctionHandler = (request, response) => {
  const { value, error } = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string()
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Z\d]{8,}$/),
    email: Joi.string().email({}).required(),
    type: Joi.string().valid("org", "volunteer").required(),
  }).validate(request.body, { abortEarly: false });

  if (error) {
    response.validationError(error.details.map(({ message }) => message));
    return;
  }

  console.log(value);

  console.log(request.body);

  logger.info("Hello logs!", { structuredData: true });

  response.send("Hello from Firebase!");
};

export default { register };
