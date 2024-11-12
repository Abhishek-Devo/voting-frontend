import React, { useState } from 'react';
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

export default function SignupPage() {
  const [aadhar, setAadhar] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("")
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (aadhar.length !== 12) {
      setError("Aadhar number must be 12 digits.");
      return;
    }
    if (mobile && mobile.length !== 10) {
      setError("Mobile number must be 10 digits.");
      return;
    }
    if (age < 18) {
      setError("Age must be greater than 18.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const formData = {
      name: name,             // string
      age: Number(age),       // convert to number since form inputs return strings
      address: address,       // string
      password: password,     // string
      aadhar: aadhar,         // string
      mobile: mobile,         // optional
      email: email            // optional
    };
    try {
      // Send a post request to create a new user
      const response=await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`,
        formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response)

      // Show success message and redirect to login page
      setSuccessMessage("User created successfully, please log in");
      setError("");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      // Show error message
      setError("Sign up failed");
      setSuccessMessage("");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="age" className="block font-medium mb-1">Age:</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="aadhar" className="block font-medium mb-1">Aadhar:</label>
            <input
              type="number"
              id="aadhar"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block font-medium mb-1">Mobile No: (optional)</label>
            <input
              type="number"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="address" className="block font-medium mb-1">Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-1">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">Email (optional):</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Sign Up
            </button>
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
