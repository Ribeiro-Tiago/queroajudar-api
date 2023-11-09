import { Request, CallableRequest } from "firebase-functions/v2/https";
import { Response } from "express";

export type HttpsFunctionHandler = (request: Request, response: Response) => Promise<void> | void;

export type OnCallHandler = <T>(request: CallableRequest<T>) => Promise<any>;

// @ts-ignore
export interface GenericObject extends object {
  [key: string]: any;
}
