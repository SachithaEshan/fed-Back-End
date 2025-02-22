import { Request, Response, NextFunction } from "express";
import SavedItem from "../Infrastructure/Schemas/SavedItem";
import Product from "../Infrastructure/Schemas/Product";
import { getAuth } from "@clerk/express";
import { Document } from 'mongoose';

interface PopulatedProduct extends Document {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  inventory: number;
}

interface PopulatedSavedItem extends Document {
  productId: PopulatedProduct;
}

export const getFavorites = async (
  req: Request, 
  res: Response,
  next: NextFunction
): Promise<void> => {
    try {
        const { userId } = getAuth(req);
        const savedItems = await SavedItem.find({ userId })
            .populate<{ productId: PopulatedProduct }>('productId')
            .exec();

        const formattedItems = savedItems.map(item => ({
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            description: item.productId.description,
            image: item.productId.image,
            inventory: item.productId.inventory
        }));

        res.json(formattedItems);
    } catch (error) {
        next(error);
    }
};

export const addFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = getAuth(req);
        const { _id: productId } = req.body;

        const existingItem = await SavedItem.findOne({ userId, productId });
        if (existingItem) {
            res.status(400).json({ message: "Item already saved" });
            return;
        }

        const savedItem = new SavedItem({ userId, productId });
        await savedItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        next(error);
    }
};

export const removeFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = getAuth(req);
        const productId = req.params.id;

        const result = await SavedItem.findOneAndDelete({ userId, productId });
        if (!result) {
            res.status(404).json({ message: "Saved item not found" });
            return;
        }

        res.json({ message: "Item removed from favorites" });
    } catch (error) {
        next(error);
    }
};