import express from 'express';
import {
  getDashboardStats,
  getAlerts,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// GET dashboard statistics - All authenticated users
router.get('/stats', getDashboardStats);

// GET system alerts - All authenticated users
router.get('/alerts', getAlerts);

export default router;
