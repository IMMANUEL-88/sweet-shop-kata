import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useAuth();

  // 1. If user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If route is for admins only and user is not an admin
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />; // Redirect to home page
  }
  
  // 3. If user is logged in (and is admin if required), show the page
  return <Outlet />;
};

export default ProtectedRoute;