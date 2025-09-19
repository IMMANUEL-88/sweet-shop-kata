import React, { useState, useEffect } from 'react';
import { getSweets } from '/src/api/api.js';
import SweetCard from '/src/components/SweetCard.jsx';
import { useAuth } from '/src/context/AuthContext.jsx';

const BestSellers = () => {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useAuth();

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const { data } = await getSweets();
        // For demonstration, we'll just take the first few as "best sellers"
        setSweets(data.slice(0, 8)); 
      } catch (error) {
        showNotification('Could not fetch best sellers.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSweets();
  }, [showNotification]);

  return (
    <div className="py-16 bg-pink-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Best Sellers</h2>
        <div className="flex overflow-x-auto space-x-8 pb-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            sweets.map(sweet => (
              <div key={sweet._id} className="flex-shrink-0 w-80">
                <SweetCard sweet={sweet} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;

