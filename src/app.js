import express from 'express';
import 'dotenv/config';
import globalErrorHandlingMiddleware from './Api/middleware/global-error-handling-middleware.js';
import{productRouter}from'./Api/product.js';
import { connectDB } from './Infrastructure/db.js';
import { categoryRouter } from './Api/category.js';

const app = express();
app.use(express.json()); // For parsing JSON requests*

//const SendHello=(req, res) => res.send('Hello!')
//app.get('/hello',SendHello);

app.use("/Api/products", productRouter);
app.use("/Api/categories", categoryRouter);
app.use(globalErrorHandlingMiddleware)

//app.get('/products', getProducts)

//app.post('/products',createProduct)

//app.get('/products/:id',getProduct)

//app.delete('/products/:id',deleteProduct)

//app.patch('/products/:id',updateProduct)
connectDB();
app.listen(3000, () => console.log(`Server running on port ${3000}`));