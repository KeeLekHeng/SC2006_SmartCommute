import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fruits, setFruits] = useState('');
  const [gender, setGender] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    fruits: '',
    gender: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'fruits':
        setFruits(value);
        break;
      case 'gender':
        setGender(value);
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: '' });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Username is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    if (password.length < 8 || password.length > 18) {
      newErrors.password = "Password must be between 8 to 18 characters long.";
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = "Password must contain both letters and numbers.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "Password must contain at least one special character.";
    }
    if (!fruits) newErrors.fruits = "Favourite fruit is required for password recovery.";
    if (!gender) newErrors.gender = "Please select a gender.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterClick = async () => {
    if (!validateFields()) return;

    const sgTime = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });

    try {
      const response = await axios.post("http://localhost:4000/authRoutes/register", {
        username,
        email,
        password,
        fruits,
        gender,
        timestamp: sgTime,
      });

      if (response.status === 201) {
        navigate('/login', { state: { alert: { show: true, message: response.data.message, type: 'success' } } });
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        const errorMessage = error.response.data.error.toLowerCase();

        if (errorMessage.includes("username")) {
          setErrors({ ...errors, username: error.response.data.error });
        } else if (errorMessage.includes("email")) {
          setErrors({ ...errors, email: error.response.data.error });
        } else {
          setErrors({ ...errors, general: error.response.data.error });
        }
      } else {
        setErrors({ ...errors, general: "Registration failed, please try again." });
      }
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="bg-[#4169E1] flex items-center justify-center h-screen overflow-hidden">
      <div className="w-11/12 max-w-lg bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col items-center relative">
        
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
          <h2 className="text-[#1D4ED8] text-3xl font-bold">SmartCommute</h2>
        </header>

        <h1 className="text-4xl font-bold text-[#1D4ED8] mb-6">Register</h1>

        <main className="w-full">
          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <label className="block text-gray-700 text-left mb-1 text-lg">Security Question: What is your favourite fruit?</label>
          <input
            type="text"
            name="fruits"
            placeholder="This is for Password Recovery"
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={fruits}
            onChange={handleInputChange}
          />
          {errors.fruits && <p className="text-red-500 text-sm">{errors.fruits}</p>}

          <label className="block text-gray-700 text-left mb-1 text-lg">Select your Gender</label>
          <select
            name="gender"
            className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={gender}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

          {errors.general && <p className="text-red-500 text-sm mt-2">{errors.general}</p>}

          <button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-[#1E40AF] hover:to-[#2563EB] transition duration-300 shadow-md hover:shadow-lg mb-4"
            onClick={handleRegisterClick}
          >
            Register
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <button
              className="text-[#1D4ED8] font-bold cursor-pointer hover:underline"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </p>
        </main>
      </div>
    </div>
  );
};

export default RegisterPage;
