import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

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
        {/* Background candy icons */}
        <div className="absolute inset-0 opacity-30 text-5xl select-none pointer-events-none">
          {/* Left cluster */}
          <div className="absolute top-1/5 left-10">🍭</div>
          <div className="absolute top-1/4 left-160">🍭</div>
          <div className="absolute top-1/4 left-60">🍬</div>
          <div className="absolute top-1/3 left-120">🍫</div>
          <div className="absolute top-2/5 left-5">🍫</div>

          {/* Right cluster */}
          <div className="absolute top-1/15 right-16">🍪</div>
          <div className="absolute top-2/5 right-8">🍩</div>
          <div className="absolute top-1/2 right-20">🍬</div>

          {/* Center elements */}
          <div className="absolute top-40 left-2/4">🍭</div>
          <div className="absolute top-3/5 left-1/2">🍫</div>

          {/* Top elements */}
          <div className="absolute top-12 left-1/4">🍪</div>
          <div className="absolute top-16 right-1/3">🍩</div>

          {/* Bottom elements */}
          <div className="absolute bottom-24 left-1/3">🍬</div>
          <div className="absolute bottom-80 left-1/6">🍬</div>
          <div className="absolute bottom-32 right-1/3">🍭</div>
          <div className="absolute bottom-20 left-16">🍫</div>
          <div className="absolute bottom-60 right-20">🍪</div>
        </div>

        {/* Foreground content */}
        <h1 className="text-4xl font-bold mb-4 relative z-10">Hello There!</h1>
        <p className="text-xl mb-6 relative z-10">🍭 Sweet to see you again!</p>
        <p className="max-w-md text-center text-md leading-relaxed relative z-10">
          Because every moment deserves a little candy magic – shop, savor, and
          smile.
        </p>
        <footer className="absolute bottom-6 text-xs opacity-80 z-10">
          © 2025 Immanuel Jeyam. All rights reserved.
        </footer>
      </div>

      {/* Right side (Login form, also used in mobile full-screen) */}
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border bg-pink-200 border-pink-400 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
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
