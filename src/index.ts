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
import savedItemsRouter from "./Api/savedItems";



const app = express();

// app.use(cors());
app.use(json());

const allowedOrigins = [
  'https://fed-storefront-backend-sachitha.netlify.app',
  'https://fed-storefront-frontend-sachitha.netlify.app',
  // 'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(clerkMiddleware());

// Routes
app.use("/Api/products", productRouter);
app.use("/Api/categories", categoryRouter);
app.use("/Api/orders", orderRouter);
app.use("/Api/payments", paymentsRouter);
app.use("/Api/savedItems", savedItemsRouter);
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

//app.use(globalErrorHandlingMiddleware);

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