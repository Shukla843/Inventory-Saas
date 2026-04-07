import mongoose from 'mongoose';

/**
 * Supplier Schema
 * Stores supplier information and contact details
 */
const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
    },
    contact: {
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
    },
    address: {
      type: String,
      trim: true,
    },
    productsSupplied: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
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

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
