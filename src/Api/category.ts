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

categoryRouter.route("/")
  .get(asyncHandler(getCategories))
  .post(isAuthenticated, asyncHandler(isAdmin), asyncHandler(createCategory));

categoryRouter.route("/:id")
  .get(asyncHandler(getCategory))
  .delete(isAuthenticated, asyncHandler(isAdmin), asyncHandler(deleteCategory))
  .patch(isAuthenticated, asyncHandler(isAdmin), asyncHandler(updateCategory));