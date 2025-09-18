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

// @desc    Update a sweet
// @route   PUT /api/sweets/:id
// @access  Private/Admin
export const updateSweet = asyncHandler(async (req, res) => {
  const { name, category, price, quantity } = req.body;
  const sweet = await Sweet.findById(req.params.id);

  if (sweet) {
    // Update fields only if they are provided in the request
    sweet.name = name ?? sweet.name;
    sweet.category = category ?? sweet.category;
    // Use `??` to allow setting price/quantity to 0, which `||` would treat as false
    sweet.price = price ?? sweet.price; 
    sweet.quantity = quantity ?? sweet.quantity;

    const updatedSweet = await sweet.save();
    res.json(updatedSweet);
  } else {
    // If sweet is not found
    res.status(404);
    throw new Error('Sweet not found');
  }
});

// @desc    Delete a sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
export const deleteSweet = asyncHandler(async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);

  if (sweet) {
    await sweet.deleteOne(); // Use deleteOne() on the document
    res.json({ message: 'Sweet removed' });
  } else {
    // If sweet is not found
    res.status(404);
    throw new Error('Sweet not found');
  }
});

// @desc    Purchase a sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
export const purchaseSweet = asyncHandler(async (req, res) => {
  // It finds a sweet matching the ID AND where quantity is greater than 0,
  // then atomically decrements the quantity by 1.
  const sweet = await Sweet.findOneAndUpdate(
    { _id: req.params.id, quantity: { $gt: 0 } },
    { $inc: { quantity: -1 } },
    { new: true }
  );

  if (sweet) {
    res.json(sweet);
  } else {
    const sweetExists = await Sweet.findById(req.params.id);
    if (!sweetExists) {
      res.status(404);
      throw new Error('Sweet not found');
    } else {
      res.status(400);
      throw new Error('Sweet is out of stock');
    }
  }
});

// @desc    Restock a sweet
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
export const restockSweet = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const restockAmount = Number(amount);
  if (!restockAmount || restockAmount <= 0) {
    res.status(400);
    throw new Error('Invalid restock amount: Must be a positive number');
  }

  // Use findByIdAndUpdate with $inc for an atomic update
  const sweet = await Sweet.findByIdAndUpdate(
    req.params.id,
    { $inc: { quantity: restockAmount } },
    { new: true, runValidators: true }
  );

  if (!sweet) {
    res.status(404);
    throw new Error('Sweet not found');
  }

  res.json(sweet);
});