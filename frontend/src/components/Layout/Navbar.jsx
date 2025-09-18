import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // If no user → don't render navbar at all
  if (!user) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="cursor-pointer">
          <h1 className="text-2xl font-bold text-pink-500">Candy Corner</h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="hidden sm:block text-gray-600 hover:text-pink-500 transition-colors"
            >
              Admin
            </Link>
          )}
          <span className="text-gray-700 text-sm sm:text-base">
            Hi, {user.username}!
          </span>
          <button
            onClick={handleLogout}
            className="bg-pink-500 text-white px-3 py-2 text-sm sm:px-4 sm:py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
