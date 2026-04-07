import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// GET all products - All authenticated users
router.get('/', getProducts);

// GET low stock products - All authenticated users
router.get('/low-stock', getLowStockProducts);

// GET single product - All authenticated users
router.get('/:id', getProduct);

// POST create product - Admin and Manager only
router.post('/', authorize('admin', 'manager'), createProduct);

// PUT update product - Admin and Manager only
router.put('/:id', authorize('admin', 'manager'), updateProduct);

// DELETE product - Admin only
router.delete('/:id', authorize('admin'), deleteProduct);

export default router;
