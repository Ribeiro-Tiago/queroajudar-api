import { Request } from "firebase-functions/v2/https";
import { Response } from "express";

export type HttpsFunctionHandler = (request: Request, response: Response) => Promise<void> | void;

// @ts-ignore
export interface GenericObject extends object {
  [key: string]: any;
}
