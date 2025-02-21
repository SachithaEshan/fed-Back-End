import express, { RequestHandler } from "express";
import {
  getCategory,
  deleteCategory,
  updateCategory,
} from "../Application/category";
import { createCategory, getCategories } from "../Application/category";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";
import asyncHandler from "express-async-handler";
import { Request } from "express";
import { AuthObject } from "@clerk/express";

// Define the type for authenticated requests
type AuthenticatedRequest = Request & {
  auth: AuthObject;
};

export const categoryRouter = express.Router();

// Public route
categoryRouter.get("/", asyncHandler(getCategories));

// Protected routes
categoryRouter.post(
  "/",
  isAuthenticated as RequestHandler,
  asyncHandler(isAdmin as RequestHandler),
  asyncHandler((req: Request, res, next) => createCategory(req, res, next))
);

categoryRouter.route("/:id")
  .get(asyncHandler(getCategory))
  .delete(
    isAuthenticated as RequestHandler,
    asyncHandler(isAdmin as RequestHandler),
    asyncHandler((req: Request, res, next) => deleteCategory(req, res, next))
  )
  .patch(
    isAuthenticated as RequestHandler,
    asyncHandler(isAdmin as RequestHandler),
    asyncHandler((req: Request, res, next) => updateCategory(req, res, next))
  );