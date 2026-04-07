import mongoose from 'mongoose';

/**
 * Warehouse Schema
 * Represents physical warehouse locations
 * Each warehouse can have its own inventory
 */
const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Warehouse name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Warehouse location is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      default: 10000, // Maximum capacity in units
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

export default Warehouse;
