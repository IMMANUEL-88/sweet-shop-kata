import React from 'react';

const Banner = () => {
  return (
    <div className="bg-pink-100">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-pink-800 font-serif leading-tight">
          Handcrafted Sweets, Pure Delight.
        </h1>
        <p className="text-pink-700 mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Experience the joy of authentic, handcrafted sweets made from the finest ingredients. Perfect for every occasion.
        </p>
        <button className="mt-8 bg-pink-500 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-600 transition-transform transform hover:scale-105">
          Shop All Sweets
        </button>
      </div>
    </div>
  );
};

export default Banner;
