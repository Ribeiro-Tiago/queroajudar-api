import { Request } from "firebase-functions/v2/https";
import { Response } from "express";

import { HttpsFunctionHandler, GenericObject } from "../types";

export const applyMiddleware = (handler: HttpsFunctionHandler) => (req: Request, res: Response) => {
  res.validationError = (errors: GenericObject, reason = "Validation error") => {
    res.status(422).json({ reason, errors });
  };

  return handler(req, res);
};
