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
      const response = await fetch('http://localhost:4000/authRoutes/forget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fruits }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ show: true, message: data.message, type: 'success' });
      } else {
        setAlert({ show: true, message: data.error, type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ show: true, message: 'An error occurred. Please try again.', type: 'error' });
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-cyan-400 to-cyan-600 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-4">
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className="w-11/12 max-w-lg bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center">
        <header className="mb-6 text-center">
          <img src={Logo} alt="logo" className="mb-4 h-40" />
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
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg shadow-sm"
          />
          <label className="block text-gray-700 text-left mb-2 text-lg">Answer Security Question (Favorite Fruit)</label>
          <input
            type="text"
            placeholder="Favorite Fruit"
            value={fruits}
            onChange={(e) => setFruits(e.target.value)}
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg shadow-sm"
          />

          <button
            className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-teal-600 hover:to-teal-800 transition duration-300 mb-4 shadow-md"
            onClick={handleSendClick}
          >
            Change to Default Password
          </button>

          <button
            className="w-full bg-gray-300 text-teal-700 py-3 px-6 rounded-lg font-bold text-lg hover:bg-gray-400 transition duration-300 shadow-md"
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
