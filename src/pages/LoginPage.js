import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Aadhaar number
    if (!/^\d{12}$/.test(aadhar)) {
      setError("Aadhaar number must be exactly 12 digits.");
      return;
    }

    // Validate password length
    if (password.length < 6 || password.length > 23) {
      setError("Password must be between 6 and 23 characters.");
      return;
    }

    const formData = {
      aadhar: aadhar,
      password: password,
    };

    try {
      // Sending login request to the backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);

      // Using localStorage to store token on successful login
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      setError("Invalid Aadhaar number or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="aadhar" className="block font-medium mb-1">
              Aadhaar Number:
            </label>
            <input
              type="text"
              id="aadhar"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Login
            </button>
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
