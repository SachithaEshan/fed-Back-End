import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ValidationError from "../domain/errors/validation-error";
import Order from "../Infrastructure/Schemas/Order";
import { getAuth } from "@clerk/express";
import NotFoundError from "../domain/errors/not-found-error";
import Address from "../Infrastructure/Schemas/address";
import SavedItem from "../Infrastructure/Schemas/SavedItem";
import { isAuthenticated } from '../Api/middleware/authentication-middleware';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';
import User from '../Infrastructure/Schemas/Order';

const orderSchema = z.object({
  items: z
    .object({
      product: z.object({
        _id: z.string(),
        name: z.string(),
        price: z.string(),
        image: z.string(),
        description: z.string(),
      }),
      quantity: z.number(),
    })
    .array(),
  shippingAddress: z.object({
    line_1: z.string(),
    line_2: z.string(),
    city: z.string(),
    state: z.string(),
    zip_code: z.string(),
    phone: z.string(),
  }),
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = req.body;
    console.log(order);
    const result = orderSchema.safeParse(order);
    if (!result.success) {
      console.log(result.error);
      throw new ValidationError("Invalid order data");
    }

    const userId = getAuth(req).userId;
    
    const address = await Address.create({
      ...result.data.shippingAddress,
    });

    await Order.create({
      userId: "user_2srK1UjoErcaUMXUW5huR8FJ3u9",
      items: result.data.items,
      addressId: address._id,
     
    });
    
    res.status(201).send();
  } catch (error) {
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