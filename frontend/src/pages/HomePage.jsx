import React, { useState, useEffect, useCallback } from "react";
// FIX: Import 'addToCart' instead of 'purchaseSweet'
import { getSweets, searchSweets } from "/src/api/api.js";
import { useAuth } from "/src/context/AuthContext.jsx";
import useDebounce from "/src/hooks/useDebounce.js";

// Import the new homepage sections
import Banner from "/src/components/HomePage/Banner.jsx";
import Categories from "/src/components/HomePage/Categories.jsx";
import BestSellers from "/src/components/HomePage/BestSellers.jsx";
import CorporateOrders from "/src/components/HomePage/CorporateOrders.jsx";
// FIX: Corrected the import path to be absolute from /src
import CategoryShowcase from "/src/components/HomePage/CategoryShowcase.jsx";
// FIX: Corrected the import path and added extension
import Footer from "/src/components/Layout/Footer.jsx";

const HomePage = () => {
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { showNotification, addToCart } = useAuth();

  // Search state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  // Debounce search terms
  const debouncedName = useDebounce(name, 300);
  const debouncedCategory = useDebounce(category, 300);

  const fetchAllSweets = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await getSweets();
      setSweets(data);
    } catch (error) {
      showNotification("Could not fetch sweets.", "error");
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
        showNotification("Search failed.", "error");
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

  // This function was defined but calling 'addToCart' which was not imported.
  // The import fix at the top of the file resolves this.
  const handleAddToCart = (sweetId, quantity) => {
    addToCart(sweetId, quantity);
  };

  return (
    <div>
      {/* Render all the homepage components in order */}

      <Banner />
      <Categories onAddToCart={handleAddToCart} />
      <BestSellers onAddToCart={handleAddToCart} />
      <CategoryShowcase
        title="Just Sweets"
        category="Sweet"
        onAddToCart={handleAddToCart}
      />
      <CategoryShowcase
        title="Just Snacks"
        category="Snacks"
        bgColor="bg-pink-200"
        onAddToCart={handleAddToCart}
      />
      <CategoryShowcase
        title="Exclusive Laddus"
        category="Laddu"
        onAddToCart={handleAddToCart}
      />
      <CorporateOrders />
      <Footer />
    </div>
  );
};

export default HomePage;
