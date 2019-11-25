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
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { Logger } from "winston";

export function handleApiErrors(args: {
  err: any;
  req: Request;
  res: Response;
  next: NextFunction;
  logger: Logger;
}) {
  let { err, req, res, next, logger } = args;

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
  } else if (err instanceof EntityNotFoundError) {
    statusCode = constants.HTTP_STATUS_NOT_FOUND;
    message = err.message;
  }

  if (err.stack) {
    logger.error(err.stack);
  }

  return res.status(statusCode).send({ message });
}
