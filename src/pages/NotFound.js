// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Go Back Home
      </Link>
    </div>
  );
}
