import React from 'react';

const SweetCard = ({ sweet, onPurchase }) => {
  const isOutOfStock = sweet.quantity === 0;
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
        <p className="text-sm text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded-full my-2">{sweet.category}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-2xl font-bold text-pink-500">₹{sweet.price.toFixed(2)}</p>
          <p className={`text-sm font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} in stock`}
          </p>
        </div>
        <button
          onClick={() => onPurchase(sweet._id)}
          disabled={isOutOfStock}
          className="w-full mt-6 py-2 px-4 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>
      </div>
    </div>
  );
};

export default SweetCard;