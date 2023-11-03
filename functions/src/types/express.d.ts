export {};

declare global {
  namespace Express {
    interface Response {
      validationError: (errors: string[], reason?: string) => void;
    }
  }
}
