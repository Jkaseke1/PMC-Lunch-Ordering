import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold mb-4 text-center text-blue-700">
        Welcome to Pulse Pharmaceuticals
      </h1>
      <p className="text-lg mb-6 text-gray-600">
        Your lunch ordering space with Ruth and Makagi caterers and delicious menus.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition duration-300"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;