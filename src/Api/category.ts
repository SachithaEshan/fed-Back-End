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

export const categoryRouter = express.Router();

// Type assertion to handle the authenticated request
categoryRouter.route("/")
  .get(asyncHandler(getCategories))
  .post(
    isAuthenticated,
    asyncHandler(isAdmin as RequestHandler),
    asyncHandler(createCategory as RequestHandler)
  );

categoryRouter.route("/:id")
  .get(asyncHandler(getCategory))
  .delete(
    isAuthenticated,
    asyncHandler(isAdmin as RequestHandler),
    asyncHandler(deleteCategory as RequestHandler)
  )
  .patch(
    isAuthenticated,
    asyncHandler(isAdmin as RequestHandler),
    asyncHandler(updateCategory as RequestHandler)
  );