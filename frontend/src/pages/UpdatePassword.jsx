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
  const [successAlert, setSuccessAlert] = useState({ show: false, message: '', type: 'success' });

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 18) {
      setPasswordError("Password must be between 8 to 18 characters long.");
      return false;
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setPasswordError("Password must contain both letters and numbers.");
      return false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError("Password must contain at least one special character.");
      return false;
    }
    return true;
  };

  const handleSendClick = async () => {
    // Reset error messages
    setEmailError('');
    setFruitError('');
    setPasswordError('');
    setAlert({ show: false, message: '', type: '' });
    setSuccessAlert({ show: false, message: '', type: 'success' });

    let hasError = false;

    // Email validation
    if (!email) {
      setEmailError('Please fill in the email field.');
      hasError = true;
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setEmailError("Invalid email format.");
      hasError = true;
    }

    // Security question validation
    if (!fruit) {
      setFruitError('Please fill in the favorite fruit field.');
      hasError = true;
    }

    // Password validation (checked last)
    if (!newPassword) {
      setPasswordError('Please fill in the new password field.');
      hasError = true;
    } else if (!validatePassword(newPassword)) {
      hasError = true; // Password validation failed
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
        setSuccessAlert({ show: true, message: 'Password reset successfully!', type: 'success' });
        setTimeout(() => {
          setSuccessAlert({ show: false, message: '', type: 'success' });
          navigate('/settings');
        }, 2000);
      } else {
        setAlert({ show: true, message: response.data.error, type: 'error' });
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        const errorMessage = error.response.data.error;

        if (errorMessage.toLowerCase().includes('email')) {
          setEmailError(errorMessage);
        } else if (errorMessage.toLowerCase().includes('security')) {
          setFruitError('Wrong answer to the security question.');
        } else {
          setAlert({ show: true, message: 'An error occurred. Please try again.', type: 'error' });
        }
      } else {
        setAlert({ show: true, message: 'User Not Found, Please Try Again.', type: 'error' });
      }
    }
  };

  const closeAlert = () => setAlert({ ...alert, show: false });
  const closeSuccessAlert = () => setSuccessAlert({ ...successAlert, show: false });

  return (
    <div className="bg-[#4169E1] flex items-center justify-center h-screen overflow-hidden relative">
      {/* Success Alert */}
      {successAlert.show && (
        <div className="absolute top-0 left-0 right-0 w-full">
          <div className="p-4 bg-green-200 text-green-800 text-center shadow-md flex justify-between items-center">
            <span className="flex-1 font-semibold">{successAlert.message}</span>
            <button onClick={closeSuccessAlert} className="text-lg font-bold px-4">&times;</button>
          </div>
        </div>
      )}

      {/* Error/General Alert */}
      {alert.show && (
        <div className="absolute top-0 left-0 right-0 w-full mt-16">
          <div className={`p-4 text-center text-sm ${alert.type === 'success' ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200'} shadow-md flex justify-between items-center`}>
            <span className="flex-1">{alert.message}</span>
            <button onClick={closeAlert} className="text-lg font-bold px-4">&times;</button>
          </div>
        </div>
      )}

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
