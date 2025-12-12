import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-green-200 text-gray-900 p-6">
      {/* Original Welcome Message */}
      <h1 className="text-4xl font-bold mb-4 text-orange-700 drop-shadow-md">
        Welcome to Our Platform
      </h1>
      <p className="text-lg mb-8 text-green-700 text-center max-w-md">
        Join us to explore amazing features and a seamless user experience. Get
        started by logging in or signing up!
      </p>
      <div className="flex space-x-4 w-full max-w-sm justify-center">
        <Link to="/login" className="w-1/2">
          <button className="w-full px-6 py-3 rounded-xl bg-orange-600 text-white text-lg font-medium shadow-lg relative overflow-hidden group">
            <span className="absolute inset-0 bg-green-700 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Login
            </span>
          </button>
        </Link>
        <Link to="/signup" className="w-1/2">
          <button className="w-full px-6 py-3 rounded-xl bg-orange-600 text-white text-lg font-medium shadow-lg relative overflow-hidden group">
            <span className="absolute inset-0 bg-green-700 scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Sign Up
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
