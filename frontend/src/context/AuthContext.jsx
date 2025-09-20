import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import {
  setAuthToken,
  registerUser,
  loginUser,
  getCart,
  addToCart as apiAddToCart,
  deleteCartItem as apiRemoveFromCart,
  purchaseFromCart as apiPurchaseFromCart,
} from "/src/api/api.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // ... (keep state: user, token, loading, notification, cart, isCartOpen)
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  
  const showNotification = useCallback((message, type = "error") => {
    setNotification({ message, type });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification({ message: '', type: '' });
  }, []);

  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await getCart();
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, [token]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (sweetId, quantity) => {
    try {
      const { data } = await apiAddToCart({ sweetId, quantity });
      setCart(data);
      // FIX: Changed text to be more generic
      showNotification('Cart updated!', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Could not add to cart.', 'error');
    }
  };

  const removeFromCart = async (sweetId) => {
    try {
      const { data } = await apiRemoveFromCart(sweetId);
      setCart(data);
      // FIX: Changed text to be more generic
      showNotification('Cart updated!', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Could not remove item.', 'error');
    }
  };

  const purchaseCart = async () => {
    try {
      const { data } = await apiPurchaseFromCart();
      setCart([]);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // ... (keep logout, useEffect, login, register)
  
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setAuthToken(null);
    setCart([]);
    if (window.location.pathname !== "/login") {
      showNotification("Logged out successfully.", "success");
      navigate("/login", { replace: true });
    }
  }, [navigate, showNotification]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          const userData = localStorage.getItem("user");
          if (userData) {
            setUser(JSON.parse(userData));
          }
          setAuthToken(token);
          fetchCart();
        } else {
          logout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token, fetchCart, logout]);

  const login = async (username, password) => {
    try {
      const { data } = await loginUser({ username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthToken(data.token);
      await fetchCart();
      showNotification("Logged in successfully!", "success");
      navigate("/", { replace: true });
    } catch (err) {
      showNotification(err.response?.data?.message || "Login failed.");
      throw err;
    }
  };

  const register = async (username, password) => {
    try {
      const { data } = await registerUser({ username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthToken(data.token);
      await fetchCart();
      showNotification("Registration successful!", "success");
      navigate("/", { replace: true });
    } catch (err) {
      showNotification(err.response?.data?.message || "Registration failed.");
      throw err;
    }
  };


  const value = {
    user,
    token,
    login,
    register,
    logout,
    notification,
    showNotification,
    closeNotification,
    cart,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    purchaseCart,
    fetchCart
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};