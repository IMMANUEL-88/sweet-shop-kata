import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext.jsx';

const FALLBACK_IMAGE_URL = 'https://placehold.co/400x400/F871B0/FFFFFF?text=Sweet';

const MiniSweetCard = ({ sweet, onAddToCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOutOfStock = sweet.quantity === 0;

  const handleQuickAdd = (e) => {
    // Stop the click from propagating to a parent link (if any)
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      navigate('/login');
    } else {
      // Pass a default quantity of 1 for a "Quick Add"
      onAddToCart(sweet._id, 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:shadow-xl transition-shadow duration-300 w-64 flex-shrink-0">
      <div className="relative">
        <img 
          src={sweet.imageUrl || FALLBACK_IMAGE_URL} 
          alt={sweet.name} 
          className="w-full h-40 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src=FALLBACK_IMAGE_URL; }}
        />
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-500">{sweet.category}</p>
        <h3 className="text-md font-semibold text-gray-800 truncate mt-1">{sweet.name}</h3>
        
        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-bold text-pink-600">
            ₹{sweet.price.toLocaleString('en-IN')}
          </p>
          
          {isOutOfStock ? (
            <span className="text-xs font-bold text-red-500">Out of Stock</span>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="bg-pink-500 text-white rounded-full w-9 h-9 flex items-center justify-center transform hover:scale-110 transition-transform"
              title="Add to Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniSweetCard;