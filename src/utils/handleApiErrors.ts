import { Request, Response, NextFunction } from "express";
import { constants } from "http2";
import { isCelebrate } from "celebrate";

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
  } else {
    statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    message = err.message || "Error";
  }

  return res.status(statusCode).send({ message });
}
