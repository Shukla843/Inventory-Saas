import express from 'express';
import {
  moveStock,
  getStockHistory,
  getRecentMovements,
  getProductStockHistory,
} from '../controllers/stockController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// POST move stock (inward/outward) - All authenticated users can update stock
router.post('/move', moveStock);

// GET stock movement history with filters - All authenticated users
router.get('/history', getStockHistory);

// GET recent stock movements - All authenticated users
router.get('/recent', getRecentMovements);

// GET stock history for specific product - All authenticated users
router.get('/product/:productId', getProductStockHistory);

export default router;
