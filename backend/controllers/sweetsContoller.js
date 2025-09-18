import { Sweet } from '../models/Sweet.js';

// @desc    Add a new sweet
// @route   POST /api/sweets
// @access  Private/Admin
export const addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    // Basic validation
    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const sweet = new Sweet({
      name,
      category,
      price,
      quantity,
    });

    const createdSweet = await sweet.save();
    res.status(201).json(createdSweet);
  } catch (error) {
    // This will catch Mongoose validation errors (like missing 'required' fields)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};