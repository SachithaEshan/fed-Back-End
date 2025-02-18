import { CategoryDTO } from "../domain/dto/category";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import Category from "../Infrastructure/Schemas/Category";
import { Request, Response, NextFunction } from "express";
//import { z } from "zod";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      res.status(400).json({ errors: ["Category with this name already exists"] });
      return;
    }

    const category = new Category({ name, description });
    await category.save();
    
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ errors: [error.message] });
    } else {
      next(error);
    }
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new NotFoundError("Product not found");
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, req.body);

    if (!category) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).send(category);
  } catch (error) {
    next(error);
  }
};