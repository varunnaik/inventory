import { Request, Response, NextFunction } from "express";
import { constants } from "http2";
import { isCelebrate } from "celebrate";
import {
  NotFoundError,
  AuthenticationError,
  NoAuthHeaderError,
  NoBearerTokenError,
  AuthorizationError
} from "../types/http/Errors";

export function handleApiErrors(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode: number = 500;
  let message: any = "Internal Server Error";

  if (isCelebrate(err)) {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    message = err.joi.details;
  } else if (err instanceof SyntaxError) {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    message = "Invalid JSON";
  } else if (err instanceof NotFoundError) {
    statusCode = constants.HTTP_STATUS_NOT_FOUND;
    message = "Route not found";
  } else if (
    err instanceof AuthenticationError ||
    err instanceof NoAuthHeaderError ||
    err instanceof NoBearerTokenError ||
    err instanceof AuthorizationError
  ) {
    statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
    message = err.message;
  }

  return res.status(statusCode).send({ message });
}
