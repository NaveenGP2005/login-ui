import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleerror, handlesuccess } from "./toast";
import image from "../images/team.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return handleerror("Please fill all the fields");
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.status === 403 && result.requiresVerification) {
        handleerror(result.error);
        setTimeout(() => navigate("/verify-otp", { state: { email: result.email } }), 2000);
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      handlesuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/welcome"), 2000);
    } catch (error) {
      handleerror(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-100 to-green-200 justify-center items-center">
      <div className="w-full max-w-xs bg-orange-100 rounded p-5 shadow-lg">
        <header className="flex flex-col items-center">
          <img className="w-20 mx-auto mb-5" src={image} alt="Team Logo" />
          <h2 className="text-orange-700 text-xl font-bold">Decentra Solve</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-green-700">Email</label>
            <input
              className="w-full p-2 mb-6 text-green-700 border-b-2 border-green-700 outline-none focus:bg-gray-300"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-green-700">Password</label>
            <input
              className="w-full p-2 mb-6 text-green-700 border-b-2 border-green-700 outline-none focus:bg-gray-300"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-orange-600 text-white text-lg font-medium shadow-lg relative overflow-hidden group disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-green-700 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                {loading ? "Logging in..." : "Login"}
              </span>
            </button>
          </div>
        </form>

        <footer className="flex justify-center text-sm mt-4"> 
          <div className="flex justify-center items-center">
            <Link
              to="/signup"
              className="text-green-700 hover:text-orange-700 "
            >
              Create Account
            </Link>
          </div>
        </footer>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
