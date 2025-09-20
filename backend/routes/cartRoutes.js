import express from 'express';
const router = express.Router();
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

// POST /api/cart - Add an item
// GET  /api/cart - View items
router.route('/').post(protect, addToCart).get(protect, getCart);

// DELETE /api/cart/:id - Remove an item
router.route('/:id')
  .delete(protect, removeFromCart);

export default router;