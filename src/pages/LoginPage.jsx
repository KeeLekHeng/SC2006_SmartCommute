import React from 'react';
import Logo from '../assets/logo.png';

const LoginPage = ({ onLogin, onGoToRegister }) => {
  // Handler for when the login button is clicked
  const handleLoginClick = () => {
    onLogin(); // Trigger the onLogin function passed from App.js
  };

  // Handler for when the register link is clicked
  const handleRegisterClick = () => {
    onGoToRegister(); // Trigger the onGoToRegister function passed from App.js
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cyan-200 overflow-hidden">
      {/* Left Placeholder Section */}
      <div className="w-1/6 flex justify-center items-center">
        <div className="bg-gray-200 h-full w-full"></div>
      </div>

      {/* Main Login Form Section */}
      <div className="w-4/6 max-w-md bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center h-full"> {/* Added h-full */}
        <header className="mb-6 text-center">
          {/* Display logo and title */}
          <img src={Logo} alt="logo" className="mb-4 h-56" />
          <h2 className="text-teal-700 text-3xl font-bold">SmartCommute</h2>
        </header>

        {/* Reduced-size Login Heading */}
        <h1 className="text-4xl font-bold text-teal-700 mb-6">Login</h1> {/* Changed text size from 5xl to 4xl */}

        <main className="w-full">
          {/* Username input field */}
          <label className="block text-gray-700 text-left mb-2 text-lg">Enter your Username</label>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
          />

          {/* Password input field */}
          <label className="block text-gray-700 text-left mb-2 text-lg">Enter your Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg"
          />

          {/* Login button */}
          <button
            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-teal-600 transition mb-4"
            onClick={handleLoginClick} // Call handleLoginClick when clicked
          >
            Login
          </button>

          {/* Link to register page */}
          <p className="text-center text-gray-600">
            New User?{' '}
            <button
              className="text-teal-700 font-bold cursor-pointer hover:underline"
              onClick={handleRegisterClick} // Call handleRegisterClick when clicked
            >
              Register
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

export default LoginPage;
