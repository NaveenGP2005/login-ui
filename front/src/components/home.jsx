import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/80 backdrop-blur-md border-b border-white/10"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AuthFlow
          </h1>
          <div className="flex gap-4">
            <Link to="/login">
              <button className="px-6 py-2 text-white hover:text-purple-400 transition-colors font-medium">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Secure Authentication
            </span>
            <br />
            <span className="text-white">Made Simple</span>
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience seamless and secure authentication with email
            verification, OTP validation, and session management. Your data is
            protected with industry-standard security practices.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/signup" className="group">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 transform">
                Get Started Free
              </button>
            </Link>
            <Link to="/login" className="group">
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all hover:border-white/50">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
            <p className="text-3xl mb-3">🔐</p>
            <h3 className="text-xl font-bold mb-2">Secure</h3>
            <p className="text-gray-400">
              Industry-standard encryption and session management
            </p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
            <p className="text-3xl mb-3">✉️</p>
            <h3 className="text-xl font-bold mb-2">Email Verified</h3>
            <p className="text-gray-400">
              OTP verification ensures your email is authentic
            </p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
            <p className="text-3xl mb-3">⚡</p>
            <h3 className="text-xl font-bold mb-2">Fast</h3>
            <p className="text-gray-400">
              Quick registration and login with smooth experience
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative border-t border-white/10 mt-20 py-8 text-center text-gray-400">
        <p>© 2024 AuthFlow. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;
