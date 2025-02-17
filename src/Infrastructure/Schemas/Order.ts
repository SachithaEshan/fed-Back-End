import mongoose from "mongoose";
import Address from './address';  // Import the Address model

const OrderProductSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },  // Changed from productId
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const ItemSchema = new mongoose.Schema({
  product: { type: OrderProductSchema, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  addressId: { type: mongoose.Schema.Types.Mixed, required: true },
  items: [ItemSchema],
  orderStatus: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING",
  },
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
