import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { AppError } from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let issues: { path: string; message: string }[] | undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    issues = err.issues.map((i) => ({
      path: i.path.join(".") || "(root)",
      message: i.message,
    }));
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  if (statusCode >= 500) logger.error({ err }, "Unhandled error");

  const includeStack =
    env.isDevelopment && statusCode >= 500 && err instanceof Error;

  res.status(statusCode).json({
    error: {
      message,
      ...(issues ? { issues } : {}),
      ...(includeStack ? { stack: err.stack } : {}),
    },
  });
};
