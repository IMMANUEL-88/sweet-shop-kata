import { Sweet } from '../models/Sweet.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Add a new sweet
// @route   POST /api/sweets
// @access  Private/Admin
export const addSweet = asyncHandler(async (req, res) => {
  const { name, category, price, quantity } = req.body;

  // Validation is handled by Mongoose and our errorHandler
  if (!name || !category || price == null || quantity == null) {
     res.status(400);
     throw new Error('Please provide all required fields');
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

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Private
export const getSweets = asyncHandler(async (req, res) => {
  const sweets = await Sweet.find({});
  res.json(sweets);
});