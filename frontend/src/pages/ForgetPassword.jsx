import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Alert from '../components/Alert';

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSendClick = () => {
    // Placeholder for backend logic
    const isValidEmail = email.includes('@'); // Simple check for demonstration

    if (isValidEmail) {
      setAlert({ show: true, message: 'New Password is sent to your email.', type: 'success' });
    } else {
      setAlert({ show: true, message: 'Email not found. Please try again.', type: 'error' });
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

          <button
            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-teal-600 transition mb-4"
            onClick={handleSendClick}
          >
            Send Reset Link
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
