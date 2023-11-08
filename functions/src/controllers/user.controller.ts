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
import { AuthErrorCodes } from "firebase/auth";

import { loginUser, registerUser, logoutUser, resetUserPasswordEmail } from "../db/user";
import { BaseUser, LoginPayload } from "../types/user";
import { HttpsFunctionHandler, OnCallHandler } from "../types";

const register: HttpsFunctionHandler = async (request, response) => {
  const { value: payload, error } = Joi.object<BaseUser>({
    name: Joi.string().required().max(255).messages({
      "string.empty": "Não pode ser vazio",
      "string.max": "Não pode ter mais que 255 caracteres",
    }),

    password: Joi.string()
      .required()
      .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/)
      .messages({
        "string.empty": "Não pode ser vazia",
        "string.pattern.base":
          "Tem que ser entre 8-255 caracters e conter pelo menos 1 maiúscula, 1 minúscula e 1 número",
      }),

    email: Joi.string().required().email({}).messages({
      "string.empty": "Não pode ser vazio",
      "string.max": "Não pode ter mais que 255 caracteres",
      "string.email": "Não é um email válido",
    }),

    type: Joi.string().required().valid("org", "volunteer").messages({
      "string.empty": "Não pode ser vazio",
      "any.only": 'Tem que ser "org" ou "voluntário"',
    }),
  }).validate(request.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    response.validationError(error);
    return;
  }

  logger.info("registering user", { payload });

  try {
    const user = await registerUser(payload);

    response.status(201).json(user);
  } catch (err) {
    if (err?.code === AuthErrorCodes.EMAIL_EXISTS) {
      response.validationError({ email: "Este email já está a ser usado" });
      return;
    }

    logger.error("failed to register user", { payload, err });
    response.error();
    return;
  }
};

const login: HttpsFunctionHandler = async (request, response) => {
  const { value: payload, error } = Joi.object<LoginPayload>({
    email: Joi.string().required().messages({ "strings.empty": "Não pode ser vazio" }),
    password: Joi.string().required().messages({ "strings.empty": "Não pode ser vazio" }),
  }).validate(request.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    response.validationError(error);
    return;
  }

  try {
    response.status(200).json(await loginUser(payload));
  } catch (err) {
    if (err.code === "auth/invalid-login-credentials") {
      response.validationError({ email: "Email inválido", password: "Palavra passe inválida" });
      return;
    }

    if (err.code === AuthErrorCodes.UNVERIFIED_EMAIL) {
      response.validationError({ email: "Email por confirmar" });
      return;
    }

    logger.error("failed to login user", { payload, err });
    response.error();
  }
};

const logout: OnCallHandler = async ({ auth }) => logoutUser(auth);

const resetPasswordEmail: HttpsFunctionHandler = async (request, response) => {
  const { value: payload, error } = Joi.object<LoginPayload>({
    email: Joi.string().required().messages({ "strings.empty": "Não pode ser vazio" }),
  }).validate(request.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    response.validationError(error);
    return;
  }

  try {
    response.status(200).json(await resetUserPasswordEmail(payload.email));
  } catch (err) {
    logger.error("failed to send reset password user", { payload, err });
    response.error();
  }
};

export default { register, login, logout, resetPasswordEmail };
