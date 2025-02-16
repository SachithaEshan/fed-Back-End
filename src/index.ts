import express, { ErrorRequestHandler } from "express";

import "dotenv/config";
import { productRouter } from "./Api/product";
import { connectDB } from "./Infrastructure/db";
import globalErrorHandlingMiddleware from "./Api/middleware/global-error-handling-middleware";
import { categoryRouter } from "./Api/category";
import cors from "cors";
import { orderRouter } from "./Api/order";
import { clerkMiddleware } from "@clerk/express";
import { paymentsRouter } from "./Api/payment";

const app = express();
app.use(express.json()); // For parsing JSON requests*

app.use(cors({ origin: "http://localhost:5173" }));
app.use(clerkMiddleware());
//const SendHello=(req, res) => res.send('Hello!')
//app.get('/hello',SendHello);

app.use("/Api/products", productRouter);
app.use("/Api/categories", categoryRouter);
// app.use("/Api/orders", clerkMiddleware(), orderRouter);
// app.use("/Api/payments", clerkMiddleware(),  paymentsRouter);
app.use("/Api/orders",  orderRouter);
app.use("/Api/payments",  paymentsRouter);

app.use(globalErrorHandlingMiddleware);



//app.get('/products', getProducts)

//app.post('/products',createProduct)

//app.get('/products/:id',getProduct)

//app.delete('/products/:id',deleteProduct)

//app.patch('/products/:id',updateProduct)
connectDB();
app.listen(8000, () => console.log(`Server running on port ${8000}`));