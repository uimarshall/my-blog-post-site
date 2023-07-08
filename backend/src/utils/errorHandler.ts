/* eslint-disable @typescript-eslint/explicit-function-return-type */
/*
 * message = error message
 * statusCode = 404, etc.
 * super = constructor method of the parent class(Error).
 */

// Error handler class
class ErrorHandler extends Error {
  path: unknown;
  errors(errors: unknown) {
    throw new Error('Method not implemented.');
  }

  code!: number;
  keyValue(keyValue: unknown) {
    throw new Error('Method not implemented.');
  }

  constructor(public message: string, public statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
