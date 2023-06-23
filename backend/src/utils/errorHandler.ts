/*
 * message = error message
 * statusCode = 404, etc.
 * super = constructor method of the parent class(Error).
 */

// Error handler class
class ErrorHandler extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
