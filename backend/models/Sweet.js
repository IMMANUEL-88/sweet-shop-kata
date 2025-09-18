import mongoose from 'mongoose';

const sweetSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, default: 0 },
}, {
  timestamps: true,
});

export const Sweet = mongoose.model('Sweet', sweetSchema);