import { Request, Response, NextFunction } from "express";
import { requireAuth as clerkRequireAuth } from "@clerk/express";

export const requireAuth = clerkRequireAuth({
  // Optional: Configure any options here
  onError: (err, req, res) => {
    res.status(401).json({ error: "Not authorized" });
  },
});
