import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Alert from '../components/Alert';

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fruits, setFruits] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSendClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/authRoutes/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, fruits }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ show: true, message: `Your password has been reset to: ${data.defaultPassword}`, type: 'success' });
      } else {
        setAlert({ show: true, message: data.error, type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ show: true, message: 'An unexpected error occurred. Please try again.', type: 'error' });
    }
  };

  const handleBackToLogin = () => {
    navigate('/login'); // Navigate back to the login page
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cyan-200 overflow-hidden">
      {/* Show alert if it is visible */}
      <div className="absolute top-0 left-0 right-0 p-4">
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className="w-4/6 max-w-md bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center">
        <header className="mb-6 text-center">
          <img src={Logo} alt="logo" className="mb-4 h-56" />
          <h2 className="text-teal-700 text-3xl font-bold">SmartCommute</h2>
        </header>

        <h1 className="text-4xl font-bold text-teal-700 mb-6">Forget Password</h1>

        <main className="w-full">
          <label className="block text-gray-700 text-left mb-2 text-lg">Enter your Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg"
          />
          <label className="block text-gray-700 text-left mb-2 text-lg">What is Your Favorite Fruit</label>
          <input
            type="text"
            placeholder="Favorite Fruit"
            value={fruits}
            onChange={(e) => setFruits(e.target.value)}
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg"
          />

          <button
            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-teal-600 transition mb-4"
            onClick={handleSendClick}
          >
            Change to Default Password
          </button>

          {/* Back to Login Button */}
          <button
            className="w-full bg-gray-300 text-teal-700 py-3 px-6 rounded-lg font-bold text-lg hover:bg-gray-400 transition"
            onClick={handleBackToLogin}
          >
            Back to Login
          </button>
        </main>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
