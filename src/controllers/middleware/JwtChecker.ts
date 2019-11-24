import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import {
  AuthenticationError,
  NoAuthHeaderError,
  NoBearerTokenError
} from "../../types/http/Errors";
import { ConfigType } from "../../types/app/Config";

export const JwtChecker = (config: ConfigType) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = <string>req.get("Authorization");

  if (!header) {
    throw new NoAuthHeaderError("Authorization header is not present");
  }

  if (
    !/^BEARER [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i.test(
      header
    )
  ) {
    throw new NoBearerTokenError("Bearer token not found");
  }

  const token = <string>header.split(" ").pop();

  let jwtPayload;

  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.user = jwtPayload;
  } catch (error) {
    throw new AuthenticationError("Invalid Authorization");
  }

  next();
};
