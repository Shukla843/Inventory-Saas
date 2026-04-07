import mongoose from 'mongoose';

/**
 * Product Schema
 * Stores product information and inventory levels
 * Each product belongs to a warehouse
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      required: [true, 'SKU is required'],
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Clothing', 'Food', 'Furniture', 'Hardware', 'Medical', 'Other'],
      default: 'Other',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      default: 10, // Alert when quantity falls below this
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Warehouse is required'],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to check if stock is low
productSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

// Index for faster queries
productSchema.index({ warehouse: 1, category: 1 });
productSchema.index({ sku: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
