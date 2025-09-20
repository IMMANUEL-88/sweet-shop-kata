import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ProfileIcon, CartIcon, SearchIcon } from '../Icons/Icons.jsx';
import { searchSweets } from '/src/api/api.js';
import useDebounce from '/src/hooks/useDebounce.js';
import SearchDropdown from './SearchDropdown.jsx'; // <-- Import the new component

const Navbar = () => {
  const { user, logout, cart, openCart } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- NEW SEARCH STATE & LOGIC ---
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchRef = useRef(null);

  // Effect to call API when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchResults = async () => {
        try {
          const { data } = await searchSweets({ name: debouncedSearchTerm });
          setResults(data);
          setIsSearchOpen(true);
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
        }
      };
      fetchResults();
    } else {
      setResults([]);
      setIsSearchOpen(false);
    }
  }, [debouncedSearchTerm]);

  // Effect to handle clicks outside of the search to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);
  
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('');
  };
  // --- END NEW SEARCH LOGIC ---

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-pink-500 font-serif">
          Sweetify
        </Link>

        {/* --- UPDATED SEARCH BAR --- */}
        <div className="hidden md:flex flex-grow max-w-xl mx-4" ref={searchRef}>
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Search for sweets, chocolates, and more..."
              className="w-full py-2 pl-4 pr-10 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (results.length > 0) setIsSearchOpen(true);
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchIcon />
            </div>

            {/* --- RENDER THE SEARCH DROPDOWN --- */}
            {isSearchOpen && (
              <SearchDropdown results={results} closeSearch={handleCloseSearch} />
            )}
          </div>
        </div>

        {/* Icons and Actions */}
        <div className="flex items-center gap-4 sm:gap-6">

          <button 
            onClick={openCart} 
            className="text-gray-600 hover:text-pink-500 transition-colors relative" 
            title="Cart"
          >
            <CartIcon />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-600 hover:text-pink-500 transition-colors"
              title="Profile"
            >
              <ProfileIcon />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 animate-fade-in-down py-1">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
                      Hi, {user.username}!
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-100"
                    >
                      Logout
                    </a>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;