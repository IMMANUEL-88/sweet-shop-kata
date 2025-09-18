import React, { useState, useEffect, useCallback } from 'react';
import { getSweets, searchSweets, purchaseSweet } from '../api/api';
import { useAuth } from '../context/AuthContext';
import SweetCard from '../components/SweetCard';
import useDebounce from '../hooks/useDebounce';

const HomePage = () => {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useAuth();
  
  // Search state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Debounce search terms to avoid spamming the API
  const debouncedName = useDebounce(name, 300);
  const debouncedCategory = useDebounce(category, 300);
  const debouncedMinPrice = useDebounce(minPrice, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);

  const fetchAllSweets = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await getSweets();
      setSweets(data);
    } catch (error) {
      showNotification('Could not fetch sweets.');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  const runSearch = useCallback(async () => {
    const params = {};
    if (debouncedName) params.name = debouncedName;
    if (debouncedCategory) params.category = debouncedCategory;
    if (debouncedMinPrice) params.minPrice = debouncedMinPrice;
    if (debouncedMaxPrice) params.maxPrice = debouncedMaxPrice;
    
    // Check if any search params exist
    if (Object.keys(params).length > 0) {
      try {
        setIsLoading(true);
        const { data } = await searchSweets(params);
        setSweets(data);
      } catch (error) {
        showNotification('Search failed.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // If no search terms, fetch all sweets
      fetchAllSweets();
    }
  }, [debouncedName, debouncedCategory, debouncedMinPrice, debouncedMaxPrice, fetchAllSweets, showNotification]);

  // Run search when debounced terms change
  useEffect(() => {
    runSearch();
  }, [runSearch]);

  const handlePurchase = async (sweetId) => {
    try {
      const { data: updatedSweet } = await purchaseSweet(sweetId);
      setSweets(currentSweets =>
        currentSweets.map(s => (s._id === sweetId ? updatedSweet : s))
      );
      showNotification(`Purchased ${updatedSweet.name}!`, 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Purchase failed.');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Treat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
          />
          <input
            type="text"
            placeholder="Search by category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
          />
          <input
            type="number"
            placeholder="Min price..."
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
          />
          <input
            type="number"
            placeholder="Max price..."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>
      
      {isLoading ? (
        <p className="text-center text-lg">Loading sweets...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sweets.length > 0 ? (
            sweets.map(sweet => (
              <SweetCard key={sweet._id} sweet={sweet} onPurchase={handlePurchase} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No sweets found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;