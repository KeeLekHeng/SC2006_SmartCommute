import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import Alert from '../components/Alert';

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || ''; // Get username from location state

  const [email, setEmail] = useState('');
  const [fruit, setFruit] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fruitError, setFruitError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSendClick = async () => {
    // Reset error messages
    setEmailError('');
    setFruitError('');
    setPasswordError('');

    let hasError = false;

    if (!email) {
      setEmailError('Please fill in the email field.');
      hasError = true;
    }
    if (!fruit) {
      setFruitError('Please fill in the favorite fruit field.');
      hasError = true;
    }
    if (!newPassword) {
      setPasswordError('Please fill in the new password field.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      console.log(username);
      const response = await axios.put(`http://localhost:4000/authRoutes/change-password/${username}`, {
        email,
        fruits: fruit,
        newPassword,
      });

      if (response.status === 200) {
        setAlert({ show: true, message: 'Password reset successfully!', type: 'success' });
        setTimeout(() => {
          navigate('/settings');
        }, 2000);
      } else {
        setAlert({ show: true, message: response.data.error , type: 'error' });
      }
    } catch (error) {
      const errorMessage = error.response && error.response.data.error
        ? error.response.data.error
        : 'User Not Found, Please Try Again.';
      setAlert({ show: true, message: errorMessage, type: 'error' });
    }
  };

  const closeAlert = () => setAlert({ ...alert, show: false });

  return (
    <div className="bg-[#4169E1] flex items-center justify-center h-screen overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-4">
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className="w-11/12 max-w-md bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center">
        <header className="mb-6 text-center">
          <img src={Logo} alt="logo" className="mb-4 h-40" />
          <h2 className="text-[#1D4ED8] text-3xl font-bold">SmartCommute</h2>
        </header>

        <h1 className="text-4xl font-bold text-[#1D4ED8] mb-6">Change Password</h1>

        <main className="w-full">
          <label className="block text-gray-700 text-left mb-2 text-lg">Enter your Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-1 p-3 border border-gray-300 rounded-lg"
          />
          {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}

          <label className="block text-gray-700 text-left mb-2 text-lg">What is your favorite fruit?</label>
          <input
            type="text"
            placeholder="Favorite Fruit"
            value={fruit}
            onChange={(e) => setFruit(e.target.value)}
            className="w-full mb-1 p-3 border border-gray-300 rounded-lg"
          />
          {fruitError && <p className="text-red-500 text-sm mb-4">{fruitError}</p>}

          <label className="block text-gray-700 text-left mb-2 text-lg">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-1 p-3 border border-gray-300 rounded-lg"
          />
          {passwordError && <p className="text-red-500 text-sm mb-6">{passwordError}</p>}

          <button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-[#1E40AF] hover:to-[#2563EB] transition duration-300 mb-4 shadow-md hover:shadow-lg"
            onClick={handleSendClick}
          >
            Reset Password
          </button>

          <button
            className="w-full bg-gray-300 text-[#1D4ED8] py-3 px-6 rounded-lg font-bold text-lg hover:bg-gray-400 transition"
            onClick={() => navigate('/settings')}
          >
            Back to Settings
          </button>
        </main>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
