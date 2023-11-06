import { GenericObject } from "./";

declare global {
  namespace Express {
    interface Response {
      validationError: (errors: GenericObject, reason?: string) => void;
      error: (reason?: string, status?: number) => void;
    }
  }
}
