import React, { createContext, useState, useEffect, useContext } from 'react';
// The fix is to use curly braces for a named import
import { jwtDecode } from 'jwt-decode'; 
// Using a more specific path to help the bundler resolve the module.
import { setAuthToken, registerUser, loginUser } from '/src/api/api.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          const userData = localStorage.getItem('user');
          if (userData) {
             setUser(JSON.parse(userData));
          }
          setAuthToken(token);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token, navigate]);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
  };

  const login = async (username, password) => {
    try {
      const { data } = await loginUser({ username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthToken(data.token);
      showNotification('Logged in successfully!', 'success');
      navigate('/', {replace: true});
    } catch (err) {
      showNotification(err.response?.data?.message || 'Login failed.');
      throw err;
    }
  };

  const register = async (username, password) => {
    try {
      const { data } = await registerUser({ username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthToken(data.token);
      showNotification('Registration successful!', 'success');
      navigate('/');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setAuthToken(null);
    // We don't navigate on initial load-logout
    if (window.location.pathname !== '/login') {
      showNotification('Logged out successfully.', 'success');
      navigate('/login');
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
    closeNotification: () => setNotification({ message: '', type: '' }),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
