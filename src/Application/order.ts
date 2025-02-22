import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ValidationError from "../domain/errors/validation-error";
import Order from "../Infrastructure/Schemas/Order";
import { getAuth } from "@clerk/express";
import NotFoundError from "../domain/errors/not-found-error";
import Address from "../Infrastructure/Schemas/address";
import { CreateOrderDTO } from "../domain/dto/order";
import SavedItem from "../Infrastructure/Schemas/SavedItem";
import { isAuthenticated } from '../Api/middleware/authentication-middleware';
import jwt from 'jsonwebtoken';
//import User from '../Infrastructure/Schemas/User';
import Product from "../Infrastructure/Schemas/Product";
import mongoose from 'mongoose';
import { requireAuth as clerkRequireAuth } from "@clerk/express";
// import { requireAuth } from "../Infrastructure/Middleware/require-auth";

// const orderSchema = z.object({
//   items: z
//     .object({
//       product: z.object({
//         _id: z.string(),
//         name: z.string(),
//         price: z.string(),
//         image: z.string(),
//         description: z.string(),
//       }),
//       quantity: z.number(),
//     })
//     .array(),
//   shippingAddress: z.object({
//     line_1: z.string(),
//     line_2: z.string(),
//     city: z.string(),
//     state: z.string(),
//     zip_code: z.string(),
//     phone: z.string(),
//   }),
// });

async function validateAndUpdateInventory(items: any[]) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of items) {
      if (!item.product._id) {
        throw new ValidationError("Product ID is required");
      }

      const product = await Product.findById(item.product._id).session(session);
      
      if (!product) {
        throw new ValidationError(`Product ${item.product._id} not found`);
      }

      // Ensure inventory is a number
      const currentInventory = Number(product.inventory);
      if (isNaN(currentInventory)) {
        throw new ValidationError(`Invalid inventory value for product ${product.name}`);
      }

      if (currentInventory < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for product ${product.name}. Available: ${currentInventory}, Requested: ${item.quantity}`
        );
      }

      // Update with explicit number conversion
      await Product.findByIdAndUpdate(
        item.product._id,
        { $set: { inventory: currentInventory - item.quantity } },
        { session, new: true }
      );
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Received request body:', req.body);
    
    const { items, shippingAddress } = CreateOrderDTO.parse(req.body);
    console.log('Parsed DTO data:', { items, shippingAddress });
    
    const { userId } = getAuth(req);
    if (!userId) {
      throw new ValidationError("User must be authenticated");
    }

    // Create address with session
    const address = await Address.create([shippingAddress], { session });
    
    // Validate inventory
    await validateAndUpdateInventory(items);

    // Create order with session
    const order = await Order.create([{
      userId,
      items,
      addressId: address[0]._id
    }], { session });

    await session.commitTransaction();

    // Populate and return
    const populatedOrder = await Order.findById(order[0]._id)
      .populate('addressId')
      .lean();
    
    res.status(201).json(populatedOrder);
  } catch (error: any) {
    await session.abortTransaction();
    
    console.error('Order creation error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: error.message,
        type: 'ValidationError'
      });
    }

    res.status(500).json({
      error: 'Failed to create order',
      details: error.message
    });
  } finally {
    session.endSession();
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate({
      path: "addressId",
      model: "Address",
    }).populate({
      path:"items."
    });
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      throw new ValidationError("User must be authenticated");
    }
    
    console.log("Fetching orders for user:", userId);

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      
      .lean()
      .exec();

    console.log("Found orders:", orders);

    if (!orders) {
      return res.status(200).json([]);
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getMyOrders:", error);
    next(error);
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    return clerkRequireAuth()(req, res, next);
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Not authorized" });
  }
};