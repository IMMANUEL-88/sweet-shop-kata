import React, { useState, useEffect } from 'react';
import { searchSweets } from '/src/api/api.js';
import MiniSweetCard from '/src/components/MiniSweetCard.jsx';
import { useAuth } from '/src/context/AuthContext.jsx';

const CategoryShowcase = ({ title, category, onAddToCart, bgColor = "bg-white" }) => {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useAuth();

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setIsLoading(true);
        const { data } = await searchSweets({ category });
        setSweets(data.slice(0, 8)); // Take up to 8 sweets
      } catch (error) {
        showNotification(`Could not fetch ${title}.`, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSweets();
  }, [category, title, showNotification]);

  return (
    <div className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-left text-gray-800 mb-8">{title}</h2>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {isLoading ? (
            <p className="text-center w-full text-gray-500">Loading sweets...</p>
          ) : (
            sweets.map(sweet => (
              <MiniSweetCard 
                key={sweet._id} 
                sweet={sweet} 
                onAddToCart={onAddToCart} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;
