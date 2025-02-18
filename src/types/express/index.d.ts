import { AuthObject } from "@clerk/express";

declare global {
  namespace Express {
    interface Request {
      auth: AuthObject;  // Remove optional modifier to match Clerk's type
    }
  }
}