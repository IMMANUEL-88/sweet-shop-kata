import React, { useState } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const FALLBACK_IMAGE_URL = 'https://placehold.co/100x100/F871B0/FFFFFF?text=Sweet';

/**
 * This is a sub-component for a single item in the search results.
 * It manages its own quantity and add-to-cart logic.
 */
function SearchResultItem({ sweet }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // The addToCart in AuthContext already handles notifications
    addToCart(sweet._id, quantity);
  };

  return (
    <div className="flex items-center p-3 hover:bg-pink-50">
      <img 
        src={sweet.imageUrl || FALLBACK_IMAGE_URL} 
        alt={sweet.name} 
        className="w-16 h-16 rounded-md object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src=FALLBACK_IMAGE_URL; }}
      />
      <div className="ml-4 flex-grow">
        <h4 className="font-semibold text-gray-800">{sweet.name}</h4>
        <p className="text-sm text-gray-600">₹{sweet.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        {/* Quantity Controls */}
        <div className="flex items-center border rounded-md">
          <button 
            onClick={() => setQuantity(q => Math.max(1, q - 1))} 
            className="w-7 h-7 text-lg font-bold text-gray-600 hover:bg-gray-100"
          >
            -
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button 
            onClick={() => setQuantity(q => Math.min(99, q + 1))} // Cap at 99
            className="w-7 h-7 text-lg font-bold text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>
        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="bg-pink-500 text-white rounded-md px-3 py-1 text-sm font-semibold hover:bg-pink-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}


/**
 * This is the main dropdown container.
 */
const SearchDropdown = ({ results, closeSearch }) => {
  return (
    <div className="absolute top-14 left-0 right-0 w-full bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[70vh] overflow-y-auto">
      <ul className="divide-y divide-gray-100">
        {results.map(sweet => (
          <li key={sweet._id}>
            <SearchResultItem sweet={sweet} />
          </li>
        ))}
      </ul>
      <div 
        onClick={closeSearch} 
        className="p-3 text-center text-sm text-pink-600 font-semibold cursor-pointer hover:bg-gray-50"
      >
        Close Search
      </div>
    </div>
  );
};

export default SearchDropdown;