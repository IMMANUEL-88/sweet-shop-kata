import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const cartItemSchema = mongoose.Schema({
  sweet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Sweet',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
}, { _id: false });

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  cart: [cartItemSchema],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// THE FIX IS HERE
userSchema.methods.matchPassword = async function (enteredPassword) {
  // You were missing the 'return' statement here
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);