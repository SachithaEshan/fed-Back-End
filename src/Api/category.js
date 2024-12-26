import express from "express";
import {
  getCategory,
  deleteCategory,
  updateCategory,
} from "../Application/category.js";
import { createCategory, getCategories } from "../Application/category.js";

export const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(getCategories)
  .post(createCategory);
categoryRouter
  .route("/:id")
  .get(getCategory)
  .delete(deleteCategory)
  .patch(updateCategory);