import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import Alert from '../components/Alert';
import { UserContext } from '../context/UserContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUsername } = useContext(UserContext);

  const initialAlert = location.state?.alert || { show: false, message: '', type: '' };
  const [alert, setAlert] = useState(initialAlert);
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsernameInput(value);
    }
    if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLoginClick = async () => {
    console.log('Username:', usernameInput);
    console.log('Password:', password);

    try {
      const response = await axios.post('http://localhost:4000/authRoutes/login', {
        username: usernameInput,
        password,
      });

      if (response.status === 200) {
        setUsername(usernameInput);
        navigate('/main', {
          state: { alert: { show: true, message: 'Login successful!', type: 'success' } },
        });
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.error
          ? error.response.data.error
          : 'User Not Found, Please Try Again.';
      setAlert({ show: true, message: errorMessage, type: 'error' });
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleForgetPasswordClick = () => {
    navigate('/forget-password');
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
    }
  }, [location.state]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-teal-400 to-teal-600 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-4">
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className="w-4/6 max-w-md bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center">
        <header className="mb-6 text-center">
          <img src={Logo} alt="logo" className="mb-4 h-56" />
          <h2 className="text-teal-700 text-3xl font-bold">SmartCommute</h2>
        </header>

        <h1 className="text-4xl font-bold text-teal-700 mb-6">Login</h1>

        <main className="w-full">
          <label className="block text-gray-700 text-left mb-2 text-lg">Enter your Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg shadow-sm"
            value={usernameInput}
            onChange={handleInputChange}
          />

          <label className="block text-gray-700 text-left mb-2 text-lg">Enter your Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg mb-2 shadow-sm"
            value={password}
            onChange={handleInputChange}
          />

          <div className="text-right mb-6">
            <button
              className="text-teal-700 font-bold text-sm cursor-pointer hover:underline"
              onClick={handleForgetPasswordClick}
            >
              Forget Password?
            </button>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg mb-4"
            onClick={handleLoginClick}
          >
            Login
          </button>

          <p className="text-center text-gray-600">
            New User?{' '}
            <button
              className="text-teal-700 font-bold cursor-pointer hover:underline"
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </p>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
