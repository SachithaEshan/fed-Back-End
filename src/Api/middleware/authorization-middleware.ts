import { Request, Response, NextFunction } from "express";
import { requireAuth } from "@clerk/express";

export const isAuthenticated = requireAuth();

export const isAdmin = async (req: Request & { auth?: any }, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return; // ✅ Explicitly return `void`
    }

    const userRole = req.auth.sessionClaims?.metadata?.role;
    if (userRole !== "admin") {
      res.status(403).json({ error: "Forbidden - Admin access required" });
      return; // ✅ Explicitly return `void`
    }

    next(); // ✅ Only call `next()` if authorized
  } catch (error) {
    console.error("Admin authorization error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
