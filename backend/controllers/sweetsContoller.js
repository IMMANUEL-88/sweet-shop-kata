import { Sweet } from '../models/Sweet.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Add a new sweet
// @route   POST /api/sweets
// @access  Private/Admin
export const addSweet = asyncHandler(async (req, res) => { // <-- WRAP HERE
  const { name, category, price, quantity } = req.body;

  // Validation is now handled by Mongoose and our errorHandler
  if (!name || !category || price == null || quantity == null) {
     res.status(400); // Set status
     throw new Error('Please provide all required fields'); // Throw error
  }

  const sweet = new Sweet({
    name,
    category,
    price,
    quantity,
  });

  const createdSweet = await sweet.save();
  res.status(201).json(createdSweet);
});