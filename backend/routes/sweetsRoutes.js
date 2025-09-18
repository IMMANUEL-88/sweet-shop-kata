import express from 'express';
const router = express.Router();
import { addSweet, getSweets, searchSweets, updateSweet } from '../controllers/sweetsContoller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// @route /api/sweets

// We chain the middleware.
// 1. `protect` checks for a valid token.
// 2. `admin` checks if that user has the 'admin' role.
// 3. `addSweet` controller only runs if both pass.
router.route('/search').get(protect, searchSweets);
router.route('/').post(protect, admin, addSweet).get(protect, getSweets);
router.route('/:id').put(protect, admin, updateSweet);

export default router;