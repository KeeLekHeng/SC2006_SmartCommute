import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Alert from '../components/Alert';

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fruit, setFruit] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSendClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/authRoutes/change-password/:userId', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fruit, newPassword }),
      });
      const result = await response.json();

      if (result.success) {
        setAlert({ show: true, message: 'Password reset successfully!', type: 'success' });
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after password reset
        }, 2000);
      } else {
        setAlert({ show: true, message: result.error || 'Error resetting password', type: 'error' });
      }
    } catch (error) {
      setAlert({ show: true, message: 'Server error. Please try again later.', type: 'error' });
    }
  };

  const closeAlert = () => setAlert({ ...alert, show: false });

  return (
    <div className="flex items-center justify-center h-screen bg-cyan-200 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-4">
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className="w-11/12 max-w-md bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center">
        <header className="mb-6 text-center">
          <img src={Logo} alt="logo" className="mb-4 h-40" />
          <h2 className="text-teal-700 text-3xl font-bold">SmartCommute</h2>
        </header>

        <h1 className="text-4xl font-bold text-teal-700 mb-6">Reset Password</h1>

        <main className="w-full">
          <label className="block text-gray-700 text-left mb-2 text-lg">Enter your Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
          />

          <label className="block text-gray-700 text-left mb-2 text-lg">What is your favorite fruit?</label>
          <input
            type="text"
            placeholder="Favorite Fruit"
            value={fruit}
            onChange={(e) => setFruit(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
          />

          <label className="block text-gray-700 text-left mb-2 text-lg">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg"
          />

          <button
            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-teal-600 transition mb-4"
            onClick={handleSendClick}
          >
            Reset Password
          </button>

          <button
            className="w-full bg-gray-300 text-teal-700 py-3 px-6 rounded-lg font-bold text-lg hover:bg-gray-400 transition"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </main>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;