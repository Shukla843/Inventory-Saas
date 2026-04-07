import mongoose from 'mongoose';

/**
 * StockMovement Schema
 * Tracks all stock movements (inward/outward)
 * Maintains complete history of inventory changes
 */
const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    type: {
      type: String,
      enum: ['inward', 'outward', 'adjustment'], // adjustment for corrections
      required: [true, 'Movement type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    reference: {
      type: String, // Order ID, Invoice number, etc.
      trim: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries on recent movements
stockMovementSchema.index({ product: 1, createdAt: -1 });
stockMovementSchema.index({ warehouse: 1, createdAt: -1 });

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

export default StockMovement;
