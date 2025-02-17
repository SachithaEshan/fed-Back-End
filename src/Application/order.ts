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
import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';
import User from '../Infrastructure/Schemas/Order';
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

      if (product.stock < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { session }
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
  try {
    const { items, shippingAddress } = CreateOrderDTO.parse(req.body);
    const userId = req.auth.userId;

    // Log the received data
    console.log('Received order data:', { items, shippingAddress, userId });

    // Validate and update inventory
    await validateAndUpdateInventory(items);

    // Create the order
    const order = await Order.create({
      userId,
      items,
      addressId: shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    next(error);
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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Get user from auth middleware
  const userId = req.user.id;

  switch (req.method) {
    case 'GET':
      try {
        const savedItems = await SavedItem.find({ userId })
          .populate('productId')
          .sort({ createdAt: -1 });
        return res.status(200).json(savedItems);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch saved items' });
      }

    case 'POST':
      try {
        const { productId } = req.body;
        const savedItem = await SavedItem.create({ userId, productId });
        return res.status(201).json(savedItem);
      } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({ error: 'Item already saved' });
        }
        return res.status(500).json({ error: 'Failed to save item' });
      }

    case 'DELETE':
      try {
        const { productId } = req.query;
        await SavedItem.findOneAndDelete({ userId, productId });
        return res.status(200).json({ message: 'Item removed successfully' });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to remove saved item' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

export const authMiddleware  = (handler: NextApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authentication' });
  }
};

export default authMiddleware(handler);

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.auth.userId;
    
    console.log("Fetching orders for user:", userId); // Debug log

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log("Found orders:", orders); // Debug log

    if (!orders) {
      return res.status(200).json([]);
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getMyOrders:", error); // Debug log
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