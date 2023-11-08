import { ValidationError } from "joi";
import { Request } from "firebase-functions/v2/https";
import { Response } from "express";

import { HttpsFunctionHandler, GenericObject } from "../types";

export const applyMiddleware = (handler: HttpsFunctionHandler) => (req: Request, res: Response) => {
  res.validationError = (errors: ValidationError | GenericObject, reason = "Validation error") => {
    if (errors instanceof ValidationError) {
      errors = errors.details.reduce((result, { message, path }) => {
        result[path[0]] = message;
        return result;
      }, {});
    }

    res.status(422).json({ reason, errors });
  };

  res.error = (reason = "Ocorreu um erro inesperado", status = 500) => {
    res.status(status).json({ reason });
  };

  return handler(req, res);
};
