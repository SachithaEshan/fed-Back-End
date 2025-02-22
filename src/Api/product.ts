import express from "express";
import asyncHandler from "express-async-handler"; // ✅ Import asyncHandler
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
productRouter.get("/", asyncHandler(getProducts)); // ✅ Wrap with asyncHandler
productRouter.get("/:id", asyncHandler(getProduct)); // ✅ Wrap with asyncHandler
//productRouter.patch("/:id", asyncHandler(updateProduct)); // ✅ Wrap with asyncHandler

// Admin protected routes
productRouter.post("/", isAuthenticated, isAdmin, asyncHandler(createProduct)); // ✅ Fix async
productRouter.put("/:id", isAuthenticated, isAdmin, asyncHandler(updateProduct));
productRouter.delete("/:id", isAuthenticated, isAdmin, asyncHandler(deleteProduct));

export { productRouter };
