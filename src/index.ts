import express, { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { json } from "body-parser";
import { orderRouter } from "./Api/order";
//import { errorHandler } from "./Infrastructure/Middleware/error-handler";
import { productRouter } from "./Api/product";
import { connectDB } from "./Infrastructure/db";
import globalErrorHandlingMiddleware from "./Api/middleware/global-error-handling-middleware";
import { categoryRouter } from "./Api/category";
import { paymentsRouter } from "./Api/payment";
import { clerkMiddleware } from "@clerk/express";
import "dotenv/config";



const app = express();

//app.use(cors());
app.use(json());
app.use(clerkMiddleware());
app.use(cors({ origin: "https://fed-storefront-frontend-sachitha.netlify.app" }));

// Routes
app.use("/Api/products", productRouter);
app.use("/Api/categories", categoryRouter);
app.use("/Api/orders", orderRouter);
app.use("/Api/payments", paymentsRouter);

// Error handling middleware should be last
//app.use(errorHandler);
// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error:", err);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message
  });
});

app.use(globalErrorHandlingMiddleware);

connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const start = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:5173/your-database");
//     console.log("Connected to MongoDB");
    
//     await connectDB();
//     app.listen(8000, () => {
//       console.log("Server is running on port 8000");
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

// start();