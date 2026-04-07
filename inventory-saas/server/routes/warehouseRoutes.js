import express from 'express';
import {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '../controllers/warehouseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// GET all warehouses - All authenticated users
router.get('/', getWarehouses);

// GET single warehouse - All authenticated users
router.get('/:id', getWarehouse);

// POST create warehouse - Admin and Manager only
router.post('/', authorize('admin', 'manager'), createWarehouse);

// PUT update warehouse - Admin and Manager only
router.put('/:id', authorize('admin', 'manager'), updateWarehouse);

// DELETE warehouse - Admin only
router.delete('/:id', authorize('admin'), deleteWarehouse);

export default router;
