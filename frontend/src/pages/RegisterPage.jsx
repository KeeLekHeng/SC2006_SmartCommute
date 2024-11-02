import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Alert from '../components/Alert';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fruits, setFruits] = useState('');
  const [gender, setGender] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'fruits') setFruits(value);
    if (name === 'gender') setGender(value);
  };

  const handleRegisterClick = async () => {
    // Get the current time in Singapore
    const sgTime = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });

    try {
      const response = await axios.post("http://localhost:4000/authRoutes/register", {
        username,
        email,
        password,
        fruits,
        gender,
        timestamp: sgTime, // Send the timestamp to the backend
      });

      if (response.status === 201) {
        navigate('/login', { state: { alert: { show: true, message: response.data.message, type: 'success' } } });
      }
    } catch (error) {
      const errorMessage = error.response && error.response.data.error
        ? error.response.data.error
        : "Registration failed, please try again.";
      setAlert({ show: true, message: errorMessage, type: "error" });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  return (
    <div className="bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center h-screen overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-4">
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className="w-11/12 max-w-lg bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col items-center">
        <header className="mb-6 text-center">
          <h2 className="text-teal-700 text-3xl font-bold">SmartCommute</h2>
        </header>

        <h1 className="text-4xl font-bold text-teal-700 mb-6">Register</h1>

        <main className="w-full">
          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Username</label>
          <input type="text" name="username" placeholder="Username" className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={username} onChange={handleInputChange} />

          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Email</label>
          <input type="email" name="email" placeholder="Email" className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={email} onChange={handleInputChange} />

          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Password</label>
          <input type="password" name="password" placeholder="Password" className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={password} onChange={handleInputChange} />

          <label className="block text-gray-700 text-left mb-1 text-lg">Security Question: What is your favourite fruit?</label>
          <input type="text" name="fruits" placeholder="This is for Password Recovery" className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={fruits} onChange={handleInputChange} />

          <label className="block text-gray-700 text-left mb-1 text-lg">Select your Gender</label>
          <select name="gender" className="w-full mb-3 p-3 border border-gray-300 rounded-lg" value={gender} onChange={handleInputChange}>
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button
            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-teal-600 transition mb-4 shadow-md hover:shadow-lg"
            onClick={handleRegisterClick}
          >
            Register
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <button
              className="text-teal-700 font-bold cursor-pointer hover:underline"
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
