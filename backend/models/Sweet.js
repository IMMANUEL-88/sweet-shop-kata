import mongoose from 'mongoose';

const sweetSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    minlength: [1, 'Name must not be empty'] 
  },
  category: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, default: 0 },
  imageUrl: { 
    type: String, 
    default: 'https://placehold.co/600x400/F871B0/FFFFFF?text=Sweet' 
  },
}, {
  timestamps: true,
});

export const Sweet = mongoose.model('Sweet', sweetSchema);
