import { CreateProductDTO } from "../domain/dto/product";
import NotFoundError from "../domain/errors/not-found-error";
import Product from "../Infrastructure/Schemas/Product";
import ValidationError from "../domain/errors/validation-error";
import { Request, Response, NextFunction } from "express";

/*const products = [
  {
    CategoryId: "67a712ca79f41238757ea53a",
    image: "/assets/products/airpods-max.png",
    id: "1",
    name: "AirPods Max",
    price: "549.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "3",
    image: "/assets/products/echo-dot.png",
    id: "2",
    name: "Echo Dot",
    price: "99.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "2",
    image: "/assets/products/pixel-buds.png",
    id: "3",
    name: "Galaxy Pixel Buds",
    price: "99.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "67a7131779f41238757ea53d",
    image: "/assets/products/quietcomfort.png",
    id: "4",
    name: "Bose QuiteComfort",
    price: "249.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "3",
    image: "/assets/products/soundlink.png",
    id: "5",
    name: "Bose SoundLink",
    price: "119.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "5",
    image: "/assets/products/apple-watch.png",
    id: "6",
    name: "Apple Watch 9",
    price: "699.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "4",
    image: "/assets/products/iphone-15.png",
    id: "7",
    name: "Apple Iphone 15",
    price: "1299.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "4",
    image: "/assets/products/pixel-8.png",
    id: "8",
    name: "Galaxy Pixel 8",
    price: "549.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
];*/

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, description, categoryId, image, inventory } = req.body;

    const product = new Product({
      name,
      price: Number(price),
      description,
      categoryId,
      image,
      inventory: Number(inventory)
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ errors: [error.message] });
    } else {
      next(error);
    }
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, description, category, image, inventory } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: Number(price),
        description,
        category,
        image,
        inventory: Number(inventory),
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
