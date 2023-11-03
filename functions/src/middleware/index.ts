import { Request } from "firebase-functions/v2/https";
import { Response } from "express";

import { HttpsFunctionHandler } from "../types";

export const applyMiddleware = (handler: HttpsFunctionHandler) => (req: Request, res: Response) => {
  res.validationError = (errors: string[], reason = "Validation error") => {
    res.status(422).json({ reason, errors });
  };

  return handler(req, res);
};
