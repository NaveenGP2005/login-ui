import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleerror, handlesuccess, handleinfo } from "./toast";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return handleerror("Please enter a valid 6-digit OTP");
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Verification failed");

      handlesuccess(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      handleerror(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await fetch("http://localhost:8080/user/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to resend OTP");

      handlesuccess(data.message);
      setCountdown(60); // 60 seconds cooldown
    } catch (error) {
      handleerror(error.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* OTP Verification Card */}
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Verify Email
            </h1>
            <p className="text-gray-300 text-sm">
              We sent a code to your email
            </p>
          </div>

          {/* Email Display */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Verification code sent to:</p>
            <p className="text-white font-semibold mt-1">{email}</p>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Enter 6-digit Code
              </label>
              <input
                type="text"
                placeholder="000000"
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white text-center text-3xl tracking-widest placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 transition-all font-mono"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-gray-400 text-sm text-center mb-4">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={resendLoading || countdown > 0}
              className="w-full px-6 py-3 bg-white/5 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0
                ? `Resend in ${countdown}s`
                : resendLoading
                ? "Sending..."
                : "Resend Code"}
            </button>
          </div>

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link
              to="/signup"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Sign Up
            </Link>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default VerifyOTP;
