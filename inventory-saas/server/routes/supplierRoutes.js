import express from 'express';
import {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// GET all suppliers - All authenticated users
router.get('/', getSuppliers);

// GET single supplier - All authenticated users
router.get('/:id', getSupplier);

// POST create supplier - Admin and Manager only
router.post('/', authorize('admin', 'manager'), createSupplier);

// PUT update supplier - Admin and Manager only
router.put('/:id', authorize('admin', 'manager'), updateSupplier);

// DELETE supplier - Admin only
router.delete('/:id', authorize('admin'), deleteSupplier);

export default router;
