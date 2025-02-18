
import { Clerk } from "@clerk/nextjs";

declare global {
  namespace Express {
    interface Request {
      auth?: Clerk.User; // This will be the type of the authenticated user
    }
  }
}