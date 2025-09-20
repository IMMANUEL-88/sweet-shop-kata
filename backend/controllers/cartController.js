import asyncHandler from '../utils/asyncHandler.js';
import { Sweet } from '../models/Sweet.js';
import { User } from '../models/User.js';

/**
 * @desc    Add an item to the logged-in user's cart or update its quantity.
 * @route   POST /api/cart
 * @access  Private
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { sweetId, quantity } = req.body;
  const numQuantity = Number(quantity);

  // 1. Validation (for 400 Bad Request)
  if (!sweetId || !numQuantity || numQuantity <= 0) {
    res.status(400);
    throw new Error('A valid sweet ID and positive quantity are required.');
  }

  // 2. Check if the sweet exists (for 404 Not Found)
  const sweet = await Sweet.findById(sweetId);
  if (!sweet) {
    res.status(404);
    throw new Error('Sweet not found');
  }

  // 3. Get the user (from 'protect' middleware)
  const user = await User.findById(req.user._id);
  const existingItemIndex = user.cart.findIndex(
    (item) => item.sweet.toString() === sweetId
  );

  if (existingItemIndex > -1) {
    // 4. If item exists, update its quantity
    user.cart[existingItemIndex].quantity += numQuantity;
  } else {
    // 5. If item is new, add it to the cart
    user.cart.push({ sweet: sweetId, quantity: numQuantity });
  }

  // 6. Save and respond
  await user.save();
  res.status(200).json(user.cart);
});

/**
 * @desc    Get all items in the logged-in user's cart.
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = asyncHandler(async (req, res) => {
  // 1. Get the user and their cart. We use .populate() to get the full
  //    details of each sweet (like name and price) instead of just the ID.
  const user = await User.findById(req.user._id).populate({
    path: 'cart.sweet',
    model: 'Sweet'
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // 2. Respond with the user's populated cart.
  res.status(200).json(user.cart);
});

/**
 * @desc    Remove an item from the user's cart.
 * @route   DELETE /api/cart/:id
 * @access  Private
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const sweetIdToRemove = req.params.id;
  const user = await User.findById(req.user._id);

  // Find the index of the item in the cart
  const itemIndex = user.cart.findIndex(
    (item) => item.sweet.toString() === sweetIdToRemove
  );

  if (itemIndex > -1) {
    // If the item is found, remove it from the array
    user.cart.splice(itemIndex, 1);
    await user.save();
    
    // We need to populate the cart again to return the full sweet details
    const updatedUser = await User.findById(req.user._id).populate('cart.sweet');
    res.status(200).json(updatedUser.cart);
  } else {
    // If the item is not in the cart, send a 404
    res.status(404);
    throw new Error('Item not found in cart');
  }
});