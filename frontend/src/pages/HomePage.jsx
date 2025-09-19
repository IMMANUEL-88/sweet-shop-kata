import React, { useState, useEffect, useCallback } from 'react';
import { getSweets, searchSweets, purchaseSweet } from '/src/api/api.js';
import { useAuth } from '/src/context/AuthContext.jsx';
import SweetCard from '/src/components/SweetCard.jsx';
import useDebounce from '/src/hooks/useDebounce.js';

// Import the new homepage sections
import Banner from '/src/components/HomePage/Banner.jsx';
import Categories from '/src/components/HomePage/Categories.jsx';
import BestSellers from '/src/components/HomePage/BestSellers.jsx';
import CorporateOrders from '/src/components/HomePage/CorporateOrders.jsx';
import Footer from '../components/Layout/Footer'

const HomePage = () => {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useAuth();

  // Search state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  // Debounce search terms
  const debouncedName = useDebounce(name, 300);
  const debouncedCategory = useDebounce(category, 300);

  const fetchAllSweets = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await getSweets();
      setSweets(data);
    } catch (error) {
      showNotification('Could not fetch sweets.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  const runSearch = useCallback(async () => {
    const params = {};
    if (debouncedName) params.name = debouncedName;
    if (debouncedCategory) params.category = debouncedCategory;

    if (Object.keys(params).length > 0) {
      try {
        setIsLoading(true);
        const { data } = await searchSweets(params);
        setSweets(data);
      } catch (error) {
        showNotification('Search failed.', 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      fetchAllSweets();
    }
  }, [debouncedName, debouncedCategory, fetchAllSweets, showNotification]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  const handlePurchase = async (sweetId) => {
    try {
      const { data: updatedSweet } = await purchaseSweet(sweetId);
      // Update the state for both the main sweets list and potentially best sellers if they are the same
      setSweets(currentSweets =>
        currentSweets.map(s => (s._id === sweetId ? updatedSweet : s))
      );
      showNotification(`Purchased ${updatedSweet.name}!`, 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Purchase failed.', 'error');
    }
  };

  return (
    <div>
      {/* Render all the homepage components in order */}
      
      <Banner />
      <Categories />
      <BestSellers />
      <CorporateOrders />
      <Footer/>
    </div>
  );
};

export default HomePage;

