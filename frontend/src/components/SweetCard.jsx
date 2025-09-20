import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// A simple placeholder image in case a sweet doesn't have one.
const FALLBACK_IMAGE_URL = 'https://placehold.co/600x400/F871B0/FFFFFF?text=Sweetify';

const SweetCard = ({ sweet, onAddToCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Local state to manage the quantity for this specific card
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = sweet.quantity === 0;

  const handleIncrement = () => {
    // Prevent increasing quantity beyond available stock
    if (quantity < sweet.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    // Prevent decreasing quantity below 1
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCartClick = () => {
    if (!user) {
      // If user is not logged in, redirect them to the login page
      navigate('/login');
    } else {
      // If logged in, call the onAddToCart function passed from the parent
      // with the sweet's ID and the selected quantity.
      onAddToCart(sweet._id, quantity);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 h-full flex flex-col border border-gray-100">
      {/* Image Section */}
      <div className="relative">
        <img 
          src={sweet.imageUrl || FALLBACK_IMAGE_URL} 
          alt={`Image of ${sweet.name}`} 
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src=FALLBACK_IMAGE_URL; }}
        />
        <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}>
          {isOutOfStock ? 'Out of Stock' : 'In Stock'}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-pink-500 font-semibold">{sweet.category}</p>
        <h3 className="text-lg font-bold text-gray-800 truncate mt-1">{sweet.name}</h3>
        
        <div className="mt-2">
            <span className="text-2xl font-extrabold text-gray-900">
              ₹{sweet.price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-500 ml-1">per item</span>
        </div>
        
        <p className="text-xs text-gray-400 mt-1">
          {sweet.quantity > 0 ? `${sweet.quantity} available` : 'Currently unavailable'}
        </p>

        {/* Action Section at the bottom */}
        <div className="mt-auto pt-4">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2.5 px-4 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <>
              <div className="flex items-center justify-center mb-3">
                <button onClick={handleDecrement} className="bg-gray-200 text-gray-700 font-bold w-8 h-8 rounded-full hover:bg-gray-300 transition-colors">-</button>
                <span className="mx-4 font-bold text-lg w-8 text-center">{quantity}</span>
                <button onClick={handleIncrement} className="bg-gray-200 text-gray-700 font-bold w-8 h-8 rounded-full hover:bg-gray-300 transition-colors">+</button>
              </div>
              <button
                onClick={handleAddToCartClick}
                className="w-full py-2.5 px-4 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 transition-colors"
              >
                {user ? 'Add to Cart' : 'Login to Add'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;

