import express, { Request, Response, NextFunction } from "express";
import { createOrder, getMyOrders } from "../Application/order";
import { validateRequest } from "../Infrastructure/Middleware/validate-request";
import { CreateOrderDTO } from "../domain/dto/order";
import { requireAuth } from "../Application/order";

const orderRouter = express.Router();

// Apply requireAuth middleware to all order routes
orderRouter.use(requireAuth);

orderRouter.post("/", validateRequest(CreateOrderDTO), createOrder as express.RequestHandler);
orderRouter.get("/my-orders", getMyOrders as express.RequestHandler);

export { orderRouter };