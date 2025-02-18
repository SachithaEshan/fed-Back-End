import { getAuth, AuthObject } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";

interface AuthenticatedRequest extends Request {
  auth: AuthObject;
}

export const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.auth?.userId) {
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};