import express from "express";
import { isAuthenticated, isAdmin } from "./middleware/authorization-middleware";
import {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../Application/Product";

const productRouter = express.Router();

// Public routes
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);

// Admin protected routes
productRouter.post("/", isAuthenticated, isAdmin, createProduct);
productRouter.put("/:id", isAuthenticated, isAdmin, updateProduct);
productRouter.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export { productRouter };
  