import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Logo from '../assets/logo.png';
import Alert from '../components/Alert';

const RegisterPage = () => {
  const navigate = useNavigate();
  const[alert,setAlert] = useState({show:false, message:'',type: ''})

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') { setUsername(value); }
    if (name === 'email') { setEmail(value); }
    if (name === 'password') { setPassword(value); }
  };

  const handleRegisterClick = async () => {
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    

    try {
      const response = await axios.post("http://localhost:4000/authRoutes/register", {
        username,
        email,
        password,
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
  }

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false }); // Hide the alert
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cyan-200 overflow-hidden">

      {/* Show alert if it is visible */}
      <div className="absolute top-0 left-0 right-0 p-4">
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className="w-4/6 max-w-md bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col items-center">
        <header className="mb-4 text-center">
          <img src={Logo} alt="logo" className="mb-4 h-56" />
          <h2 className="text-teal-700 text-3xl font-bold">SmartCommute</h2>
        </header>

        <h1 className="text-4xl font-bold text-teal-700 mb-4">Register</h1> 

        <main className="w-full">
          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Username</label>
          <input type="text" name="username" placeholder="Username" className="w-full mb-3 p-3 border border-gray-300 rounded-lg"
            value={username}
            onChange={handleInputChange} />

          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Email</label>
          <input type="email" name="email" placeholder="Email" className="w-full mb-3 p-3 border border-gray-300 rounded-lg" 
            value={email}
            onChange={handleInputChange}/>

          <label className="block text-gray-700 text-left mb-1 text-lg">Enter your Password</label>
          <input type="password" name="password" placeholder="Password" className="w-full mb-6 p-3 border border-gray-300 rounded-lg" 
            value={password}
            onChange={handleInputChange}/>

          <button
            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-teal-600 transition mb-4"
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
