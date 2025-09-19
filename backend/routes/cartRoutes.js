import express from 'express';
const router = express.Router();
import { addToCart, getCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

// POST /api/cart - Add an item
router.route('/').post(protect, addToCart).get(protect, getCart);

export default router;