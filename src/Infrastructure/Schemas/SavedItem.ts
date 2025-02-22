import mongoose from 'mongoose';

const savedItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate saves
savedItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model('SavedItem', savedItemSchema);