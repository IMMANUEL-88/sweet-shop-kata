import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout & Components
import Navbar from "./components/Layout/Navbar";
import Notification from "./components/Layout/Notification";
import CartSlider from "./components/Layout/CartSlider";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import DiscountHeader from "./components/DiscountHeader";

// Main App Component with routing
function AppContent() {
  const { notification, closeNotification, user, isCartOpen } = useAuth();
  const location = useLocation();

  // Don’t show navbar/discount on login/register pages
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      {isCartOpen && <CartSlider />}

      {!hideLayout && user && (
        <div className="sticky top-0 z-40 shadow-md">
          <DiscountHeader />
          <Navbar />
        </div>
      )}

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