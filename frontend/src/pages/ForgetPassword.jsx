import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Alert from '../components/Alert';

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fruits, setFruits] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    fruits: '',
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') setEmail(value);
    if (name === 'fruits') setFruits(value);

    setErrors({ ...errors, [name]: '' });
  };

  const handleSendClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/authRoutes/forget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fruits }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success alert using the original alert system
        setAlert({ show: true, message: data.message, type: 'success' });
      } else {
        // Handle specific field errors
        if (data.error.toLowerCase().includes('email')) {
          setErrors({ ...errors, email: data.error });
        } else if (data.error.toLowerCase().includes('security')) {
          setErrors({ ...errors, fruits: data.error });
        } else {
          setAlert({ show: true, message: data.error, type: 'error' });
        }
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
    <div className="flex items-center justify-center h-screen bg-[#4169E1] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-4">
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className="w-11/12 max-w-lg bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center relative">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 shadow transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <header className="mb-6 text-center">
          <img src={Logo} alt="logo" className="mb-4 h-40" />
          <h2 className="text-[#1D4ED8] text-3xl font-bold">SmartCommute</h2>
        </header>

        <h1 className="text-4xl font-bold text-[#1D4ED8] mb-6">Forget Password</h1>

        <main className="w-full">
          <label className="block text-gray-700 text-left mb-2 text-lg">Enter your Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg shadow-sm"
          />
          {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

          <label className="block text-gray-700 text-left mb-2 text-lg">Answer Security Question (Favorite Fruit)</label>
          <input
            type="text"
            name="fruits"
            placeholder="Favorite Fruit"
            value={fruits}
            onChange={handleInputChange}
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg shadow-sm"
          />
          {errors.fruits && <p className="text-red-500 text-sm mb-3">{errors.fruits}</p>}

          <button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-[#1E40AF] hover:to-[#2563EB] transition duration-300 mb-4 shadow-md hover:shadow-lg"
            onClick={handleSendClick}
          >
            Change to Default Password
          </button>

          <button
            className="w-full bg-gray-300 text-[#1D4ED8] py-3 px-6 rounded-lg font-bold text-lg hover:bg-gray-400 transition duration-300 shadow-md"
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
