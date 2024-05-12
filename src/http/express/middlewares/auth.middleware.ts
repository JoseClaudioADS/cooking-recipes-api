import { Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { UnauthorizedError } from "../../../core/shared/errors/unauthorized.error";
import constants from "../../../utils/constants";
import env from "../../../utils/env";

export const authMiddleware = (req: Request, _: Response, next: () => void) => {
  if (!req.cookies[constants.TOKEN_COOKIE_NAME]) {
    throw new UnauthorizedError();
  }

  const token = req.cookies[constants.TOKEN_COOKIE_NAME];

  try {
    const { id, email, name } = verify(token, env.JWT_SECRET_KEY) as JwtPayload;

    req.user = {
      id,
      email,
      name,
    };
  } catch (error) {
    throw new UnauthorizedError();
  }

  next();
};
