import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  inventory: { 
    type: Number, 
    required: true,
    min: 0 
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;