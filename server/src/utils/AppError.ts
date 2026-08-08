export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational = true;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, AppError);
  }

  static notFound(message = "Resource not found"): AppError {
    return new AppError(message, 404);
  }

  static badRequest(message = "Bad request"): AppError {
    return new AppError(message, 400);
  }
}
