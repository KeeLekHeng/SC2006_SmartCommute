import React from 'react';
import Logo from '../assets/logo.png';

const RegisterPage = ({ onRegister, onGoToLogin }) => {
  // Handler for when the register button is clicked
  const handleRegisterClick = () => {
    onRegister(); // Trigger the onRegister function passed from App.js
  };

  // Handler for when the login link is clicked
  const handleLoginClick = () => {
    onGoToLogin(); // Trigger the onGoToLogin function passed from App.js
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cyan-200 overflow-hidden">
      {/* Left Placeholder Section */}
      <div className="w-1/6 flex justify-center items-center">
        <div className="bg-gray-200 h-full w-full"></div>
      </div>

      {/* Main Register Form Section */}
      <div className="w-4/6 max-w-md bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col items-center">
        <header className="mb-4 text-center">
          {/* Display logo and title */}
          <img src={Logo} alt="logo" className="mb-4 h-56" />
          <h2 className="text-teal-700 text-3xl font-bold">SmartCommute</h2>
        </header>

        {/* Register Heading */}
        <h1 className="text-4xl font-bold text-teal-700 mb-4">Register</h1> 

        <main className="w-full">
            {/* Username input field */}
          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Username</label>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg" // Reduced margin
          />

          {/* Email input field */}
          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg" // Reduced margin
          />

          {/* Password input field */}
          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg" // Reduced margin
          />

          {/* Register button */}
          <button
            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-teal-600 transition mb-4"
            onClick={handleRegisterClick} // Call handleRegisterClick when clicked
          >
            Register
          </button>

          {/* Link to login page */}
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <button
              className="text-teal-700 font-bold cursor-pointer hover:underline"
              onClick={handleLoginClick} // Call handleLoginClick when clicked
            >
              Login
            </button>
          </p>
        </main>
      </div>

      {/* Right Placeholder Section */}
      <div className="w-1/6 flex justify-center items-center">
        <div className="bg-gray-200 h-full w-full"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
