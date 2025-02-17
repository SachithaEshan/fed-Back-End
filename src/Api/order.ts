import express from "express";
import { createOrder, getMyOrders } from "../Application/order";
import { validateRequest } from "../Infrastructure/Middleware/validate-request";
import { CreateOrderDTO } from "../domain/dto/order";
import { requireAuth } from "../Application/order";

const orderRouter = express.Router();

// Apply requireAuth middleware to all order routes
orderRouter.use(requireAuth);

orderRouter.post("/", validateRequest(CreateOrderDTO), createOrder);
orderRouter.get("/my-orders", getMyOrders);

export { orderRouter };