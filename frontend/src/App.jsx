import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout & Components
import Navbar from "./components/Layout/Navbar";
import Notification from "./components/Layout/Notification";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import DiscountHeader from "./components/DiscountHeader";

// Main App Component with routing
function AppContent() {
  const { notification, closeNotification } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes (for all logged-in users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Protected Routes (for Admins only) */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

// Wrapper component to provide Context to AppContent
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
