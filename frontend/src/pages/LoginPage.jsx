import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

// --- Icon Components ---
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
  </svg>
);
// --- End Icon Components ---


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(username, password);
      // AuthContext handles navigation
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-pink-200 relative">
      {/* Background candy icons for mobile */}
      <div className="absolute inset-0 opacity-40 text-4xl select-none pointer-events-none lg:hidden">
        <div className="absolute top-10 left-10">🍭</div>
        <div className="absolute top-20 right-60">🍪</div>
        <div className="absolute top-12 right-12">🍫</div>
        <div className="absolute top-50 left-15">🍫</div>
        <div className="absolute top-50 right-50">🍩</div>
        <div className="absolute top-48 right-12">🍪</div>
        <div className="absolute top-1/2 left-1/3">🍩</div>
        <div className="absolute bottom-50 left-10">🍫</div>
        <div className="absolute bottom-60 right-50">🍩</div>
        <div className="absolute bottom-70 right-12">🍪</div>
        <div className="absolute bottom-30 left-30">🍪</div>
        <div className="absolute bottom-20 right-50">🍭</div>
        <div className="absolute bottom-38 right-12">🍩</div>
        <div className="absolute bottom-6 w-full text-pink-700 font-extrabold text-center text-xs opacity-100">
          © 2025 Immanuel Jeyam. All rights reserved.
        </div>
      </div>

      {/* Left side (Desktop only) */}
      <div className="hidden lg:flex w-1/2 bg-pink-600 text-white flex-col justify-center items-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 text-5xl select-none pointer-events-none">
          <div className="absolute top-1/5 left-10">🍭</div>
          <div className="absolute top-1/4 left-160">🍭</div>
          <div className="absolute top-1/4 left-60">🍬</div>
          <div className="absolute top-1/3 left-120">🍫</div>
          <div className="absolute top-2/5 left-5">🍫</div>
          <div className="absolute top-1/15 right-16">🍪</div>
          <div className="absolute top-2/5 right-8">🍩</div>
          <div className="absolute top-1/2 right-20">🍬</div>
          <div className="absolute top-40 left-2/4">🍭</div>
          <div className="absolute top-3/5 left-1/2">🍫</div>
          <div className="absolute top-12 left-1/4">🍪</div>
          <div className="absolute top-16 right-1/3">🍩</div>
          <div className="absolute bottom-24 left-1/3">🍬</div>
          <div className="absolute bottom-80 left-1/6">🍬</div>
          <div className="absolute bottom-32 right-1/3">🍭</div>
          <div className="absolute bottom-20 left-16">🍫</div>
          <div className="absolute bottom-60 right-20">🍪</div>
        </div>
        <h1 className="text-4xl font-bold mb-4 relative z-10">Hello There!</h1>
        <p className="text-xl mb-6 relative z-10">🍭 Sweet to see you again!</p>
        <p className="max-w-md text-center text-md leading-relaxed relative z-10">
          Every moment deserves a little candy magic – shop, savor, and
          smile.
        </p>
        <footer className="absolute bottom-6 text-xs opacity-80 z-10">
          © 2025 Sweetify. All rights reserved.
        </footer>
      </div>

      {/* Right side (Login form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-md bg-pink-300 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Savor the sweetness, share the smiles. 🍫
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-red-500 text-center bg-red-100 p-2 rounded-md">
                {error}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 border bg-pink-200 border-pink-400 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            
            {/* --- PASSWORD INPUT (UPDATED) --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  // --- THIS IS THE FIX ---
                  // Changed 'e.targe' to 'e.target.value'
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border bg-pink-200 border-pink-400 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-pink-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            {/* --- END PASSWORD INPUT --- */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 disabled:bg-pink-300 transition-colors"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-pink-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

