import { Request, Response, NextFunction } from "express";
import { requireAuth as clerkRequireAuth } from "@clerk/express";

// Custom requireAuth wrapper
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Call Clerk's requireAuth middleware
    clerkRequireAuth()(req, res, next);
  } catch (err) {
    res.status(401).json({ error: "Not authorized" });
  }
};
