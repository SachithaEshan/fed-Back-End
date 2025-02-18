import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
  name: string;
}

const globalErrorHandlingMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  if (error.name === "NotFoundError") {
    return res
      .status(404)
      .json({
        message: error.message,
      });
  } 
  
  if (error.name === "ValidationError") {
    return res
      .status(400)
      .json({
        message: error.message,
      });
  } 
  
  if (error.name === "UnauthorizedError") {
    return res
      .status(401)
      .json({
        message: error.message,
      });
  }
  
  return res
    .status(error.status || 500)
    .json({
      message: error.message || 'Internal server error',
    });
};

export default globalErrorHandlingMiddleware;