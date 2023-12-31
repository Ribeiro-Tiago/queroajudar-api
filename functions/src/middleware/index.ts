import { ValidationError } from "joi";
import { Request } from "firebase-functions/v2/https";
import { Response } from "express";

import { HttpsFunctionHandler, GenericObject } from "../types";

export const formatErrors = (errors: any) => {
  if (errors instanceof ValidationError) {
    return errors.details.reduce((result, { message, path }) => {
      result[path[0]] = message;
      return result;
    }, {});
  }

  return errors;
};

export const applyMiddleware =
  (handler: HttpsFunctionHandler) => (req: Request, res: Response) => {
    res.validationError = (
      errors: ValidationError | GenericObject,
      reason = "Validation error"
    ) => {
      console.log("errrrr");
      res.status(422).json({ reason, errors: formatErrors(errors) });
    };

    res.error = (reason = "Ocorreu um erro inesperado", status = 500) => {
      res.status(status).json({ reason });
    };

    return handler(req, res);
  };
