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

// @desc    Search for sweets
// @route   GET /api/sweets/search
// @access  Private
export const searchSweets = asyncHandler(async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  // Build the query object dynamically
  const query = {};

  if (name) {
    // $regex provides partial matching, $options: 'i' makes it case-insensitive
    query.name = { $regex: name, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  // Handle price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = Number(minPrice); // $gte = greater than or equal to
    }
    if (maxPrice) {
      query.price.$lte = Number(maxPrice); // $lte = less than or equal to
    }
  }

  const sweets = await Sweet.find(query);
  res.json(sweets);
});