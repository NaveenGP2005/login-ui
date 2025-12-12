import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleerror, handlesuccess, handleinfo } from "./toast";
import image from "../images/team.jpg";

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-100 to-green-200">
      <div className="bg-orange-100 p-6 rounded-lg shadow-lg w-80">
        <header className="flex flex-col items-center">
          <img className="w-20 mx-auto mb-4" src={image} alt="Team Logo" />
          <h2 className="text-orange-700 text-xl font-bold">Decentra Solve</h2>
        </header>

        <div className="text-center mb-4">
          <h3 className="text-green-700 text-lg font-semibold">Verify Your Email</h3>
          <p className="text-gray-600 text-sm mt-2">
            We've sent a 6-digit OTP to <br />
            <span className="font-medium text-orange-700">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="w-full p-3 border rounded text-center text-2xl tracking-widest"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-orange-600 text-white text-lg font-medium shadow-lg relative overflow-hidden group disabled:opacity-50"
          >
            <span className="absolute inset-0 bg-green-700 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              {loading ? "Verifying..." : "Verify OTP"}
            </span>
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">Didn't receive the OTP?</p>
          <button
            onClick={handleResendOTP}
            disabled={resendLoading || countdown > 0}
            className="text-orange-700 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {countdown > 0
              ? `Resend in ${countdown}s`
              : resendLoading
              ? "Sending..."
              : "Resend OTP"}
          </button>
        </div>

        <p className="mt-4 text-center text-green-700 text-sm">
          <Link to="/signup" className="text-orange-700 hover:text-green-700">
            ← Back to Signup
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default VerifyOTP;