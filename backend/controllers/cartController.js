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

  // --- FIX 1: Allow negative quantities (for decrementing) ---
  if (!sweetId || !numQuantity || numQuantity === 0) {
    res.status(400);
    throw new Error('A valid sweet ID and non-zero quantity are required.');
  }

  const sweet = await Sweet.findById(sweetId);
  if (!sweet) {
    res.status(404);
    throw new Error('Sweet not found');
  }

  const user = req.user; 
  
  const existingItemIndex = user.cart.findIndex(
    (item) => item.sweet.toString() === sweetId
  );

  if (existingItemIndex > -1) {
    user.cart[existingItemIndex].quantity += numQuantity;
  } else {
    user.cart.push({ sweet: sweetId, quantity: numQuantity });
  }

  await user.save();
  
  // --- FIX 2: Populate the cart before sending it back ---
  // This ensures the frontend gets the full sweet details (name, price, etc.)
  await user.populate('cart.sweet');

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

/**
 * @desc    Purchase all items from the user's cart.
 * @route   POST /api/cart/purchase
 * @access  Private
 */
export const purchaseFromCart = asyncHandler(async (req, res) => {
  // 1. Get the user and their cart.
  // We MUST .populate() the cart to get the sweet details (like stock quantity)
  const user = await User.findById(req.user._id).populate('cart.sweet');

  if (!user.cart || user.cart.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  // 2. VALIDATE PHASE: Check stock for ALL items before making any changes.
  for (const item of user.cart) {
    if (item.quantity > item.sweet.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${item.sweet.name}. Available: ${item.sweet.quantity}, In Cart: ${item.quantity}`);
    }
  }

  // 3. UPDATE PHASE: If all items are in stock, update all sweet quantities.
  // We create an array of all the update operations.
  const updatePromises = user.cart.map(item => 
    Sweet.findByIdAndUpdate(item.sweet._id, {
      $inc: { quantity: -item.quantity } // Atomically decrement the quantity
    })
  );
  
  // Wait for all updates to complete
  await Promise.all(updatePromises);
  
  // 4. CLEAR CART: If all stock updates are successful, clear the user's cart.
  user.cart = [];
  await user.save();

  res.status(200).json({ message: 'Purchase successful!' });
});