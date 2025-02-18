import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    if (!connectionString) {
      throw new Error("No connection string found");
    }

    await mongoose.connect(connectionString, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log("Connected to the Database");
  } catch (error) {
    console.error("Database connection error:", error);
    // Critical error - should terminate the application
    process.exit(1);
  }
};