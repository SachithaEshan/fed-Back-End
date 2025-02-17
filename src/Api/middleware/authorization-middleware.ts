import { Request, Response, NextFunction } from "express";
import { clerkMiddleware, requireAuth } from '@clerk/express'

export const isAuthenticated = requireAuth();

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { auth } = req;
    
    if (!auth?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (auth.sessionClaims?.metadata?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};