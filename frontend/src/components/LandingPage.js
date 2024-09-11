import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/food-background.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(100%)', // Brighten the background picture back to normal
  };

  const handleLogin = () => {
    // Add swinging effect after logging in
    const textElement = document.querySelector('.swing-text');
    if (textElement) {
      textElement.classList.add('swing-animation');
      setTimeout(() => {
        textElement.classList.remove('swing-animation');
      }, 1000); // Adjust the duration as needed
    }
  };

  return (
    <div style={backgroundStyle} className="flex flex-col items-center justify-center min-h-screen w-full h-full">
      <h1 className="text-5xl font-bold mb-4 text-center text-blue-700 swing-text border-4 border-blue-700 p-4 rounded">
        Welcome to Pulse Pharmaceuticals
      </h1>
      <p className="text-lg mb-6 text-gray-600 border-4 border-gray-400 p-4 rounded">
        Your lunch ordering space with Ruth and Makagi caterers and delicious menus.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          onClick={handleLogin}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300 border-4 border-blue-500"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition duration-300 border-4 border-green-500"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
