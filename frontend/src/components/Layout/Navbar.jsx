import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ProfileIcon, CartIcon, SearchIcon } from '../Icons/Icons'; // New Icon component

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-pink-500 font-serif">
          Sweetify
        </Link>

        {/* Search Bar (Centered) */}
        <div className="hidden md:flex flex-grow max-w-xl mx-4">
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Search for sweets, chocolates, and more..."
              className="w-full py-2 pl-4 pr-10 text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <SearchIcon />
            </div>
          </div>
        </div>

        {/* Icons and Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button className="text-gray-600 hover:text-pink-500 transition-colors">
            <CartIcon />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-600 hover:text-pink-500 transition-colors"
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

