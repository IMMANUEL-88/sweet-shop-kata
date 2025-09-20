import express from 'express';
const router = express.Router();
import { addToCart, getCart, removeFromCart, purchaseFromCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

// POST /api/cart - Add an item
// GET  /api/cart - View items
router.route('/').post(protect, addToCart).get(protect, getCart);

// POST /api/cart/purchase (Purchase all items)
router.route('/purchase')
  .post(protect, purchaseFromCart);

// DELETE /api/cart/:id - Remove an item
router.route('/:id')
  .delete(protect, removeFromCart);

export default router;