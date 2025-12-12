import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleerror, handlesuccess } from "./toast";

const Welcome = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/check-session", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.isAuthenticated) {
        navigate("/login");
        return;
      }

      setName(data.name);
      setEmail(data.email);
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        handlesuccess(data.message);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      handleerror(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-white mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Welcome Card */}
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome!</h1>
              <p className="text-white/80 text-sm mt-1">You're all set</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* User Info Cards */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Display Name</p>
                <p className="text-white font-semibold text-lg mt-1">{name}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Email Address</p>
                <p className="text-white font-semibold text-lg mt-1 truncate">
                  {email}
                </p>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg p-4 text-center">
              <p className="text-green-300 text-sm">
                ✓ Email verified successfully
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all hover:scale-105 transform"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl">🔒</p>
            <p className="text-gray-400 text-xs mt-1">Secure</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl">✓</p>
            <p className="text-gray-400 text-xs mt-1">Verified</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl">⚡</p>
            <p className="text-gray-400 text-xs mt-1">Active</p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Welcome;
