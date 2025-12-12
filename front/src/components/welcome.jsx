import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleerror, handlesuccess } from "./toast";
import image from "../images/team.jpg";

const Welcome = () => {
  const [name, setName] = useState("");
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-100 to-green-200">
        <div className="text-orange-700 text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-orange-100 to-green-200">
      <div className="bg-orange-100 p-6 rounded-lg shadow-lg text-center">
        <header className="flex flex-col items-center mb-4">
          <img className="w-20 mx-auto" src={image} alt="Team Logo" />
          <h2 className="text-orange-700 text-xl font-bold">Decentra Solve</h2>
        </header>
        <h2 className="text-2xl font-semibold mb-4">
          Welcome, <span className="text-green-700">{name}</span>! 🎉
        </h2>
        <p className="text-gray-700 mb-4">You are successfully logged in.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 rounded-xl bg-orange-600 text-white text-lg font-medium shadow-lg relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-green-700 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Logout
          </span>
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Welcome;
