import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      errors: Object.values(err.errors).map((err: any) => err.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      errors: ["Invalid ID format"],
    });
  }

  res.status(err.status || 500).json({
    errors: [err.message || "Something went wrong"],
  });
}; 