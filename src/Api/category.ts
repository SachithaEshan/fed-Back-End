import express from "express";
import {
  getCategory,
  deleteCategory,
  updateCategory,
} from "../Application/category";
import { createCategory, getCategories } from "../Application/category";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

export const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(getCategories)
  .post(isAuthenticated, isAdmin, createCategory); //Remove isAuthenticated and isAdmin for using with Postman
categoryRouter
  .route("/:id")
  .get(getCategory)
  .delete(isAuthenticated, isAdmin, deleteCategory)
  .patch(isAuthenticated, isAdmin, updateCategory);