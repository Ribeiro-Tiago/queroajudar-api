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

import dbPosts from "../db/post";
import { OnCallHandler } from "../types";
import { NewPost, Post } from "../types/post";
import { formatErrors } from "../middleware";
import { HttpsError } from "firebase-functions/v2/https";
import { orderBy } from "firebase/firestore";

const getPosts: OnCallHandler = async ({ auth }) => {
  // const { value: payload, error } = Joi.object<BaseUser>({
  //   name: Joi.string().required().max(255).messages({
  //     "string.empty": "Não pode ser vazio",
  //     "string.max": "Não pode ter mais que 255 caracteres",
  //   }),

  //   password: Joi.string()
  //     .required()
  //     .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/)
  //     .messages({
  //       "string.empty": "Não pode ser vazia",
  //       "string.pattern.base":
  //         "Tem que ser entre 8-255 caracters e conter pelo menos 1 maiúscula, 1 minúscula e 1 número",
  //     }),

  //   email: Joi.string().required().email({}).messages({
  //     "string.empty": "Não pode ser vazio",
  //     "string.max": "Não pode ter mais que 255 caracteres",
  //     "string.email": "Não é um email válido",
  //   }),

  //   type: Joi.string().required().valid("org", "volunteer").messages({
  //     "string.empty": "Não pode ser vazio",
  //     "any.only": 'Tem que ser "org" ou "voluntário"',
  //   }),
  // }).validate(request.body, { abortEarly: false, stripUnknown: true });

  // if (error) {
  //   response.validationError(error);
  //   return;
  // }

  return await dbPosts.getPosts(orderBy("createBy", "desc"));
};

const addPost: OnCallHandler = async ({ auth, data }) => {
  console.log(auth);
  // if no auth, don't go further
  if (!auth) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }

  const { value: payload, error } = Joi.object<NewPost>({
    description: Joi.string().required().max(255).messages({
      "string.empty": "Não pode ser vazio",
      "string.max": "Não pode ter mais que 255 caracteres",
    }),
    title: Joi.string().required().max(255).messages({
      "string.empty": "Não pode ser vazio",
      "string.max": "Não pode ter mais que 255 caracteres",
    }),
    // @ts-ignore
    categories: Joi.array()
      .items(Joi.string().valid("money", "people", "goods", "other"))
      .required()
      .min(1)
      .max(4)
      .messages({
        "string.empty": "Não pode ser vazio",
        "string.max": "Só pode escolher no máximo 4",
        "array.min": "Tem que escolher pelo menos uma opção",
        "array.max": "Só pode escolher no máximo 4 opções",
      }),
    locations: Joi.array().items(Joi.string()).required().min(1).messages({
      "string.empty": "Não pode ser vazio",
      "array.min": "Tem que escolher pelo menos uma opção",
    }),
    schedule: Joi.object().required().messages({
      "string.empty": "Não pode ser vazio",
    }),
  }).validate(data, { abortEarly: false, stripUnknown: true });

  if (error) {
    throw new HttpsError(
      "invalid-argument",
      "Validation failed",
      formatErrors(error)
    );
  }

  try {
    return await dbPosts.addPost(payload);
  } catch (err) {
    logger.error("failed to create post", { payload, err });
    throw new HttpsError("internal", "Something went wrong");
  }
};

export default { getPosts, addPost };
