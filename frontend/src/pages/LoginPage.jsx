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
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsernameInput(value);
    }
    if (name === 'password') {
      setPassword(value);
    }
    setErrors({ ...errors, [name]: '' });
  };

  const handleLoginClick = async () => {
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
      const errorMessage = error.response && error.response.data.error
        ? error.response.data.error
        : 'User Not Found, Please Try Again.';

      if (errorMessage.toLowerCase().includes('user not found')) {
        setErrors({ ...errors, username: errorMessage });
      } else if (errorMessage.toLowerCase().includes('invalid credentials')) {
        setErrors({ ...errors, password: errorMessage });
      } else {
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
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
    <div className={styles.container}>
      <div className={styles.alertContainer}>
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className={styles.card}>
        
        {/* Back Button with Larger Clickable Area */}
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <header className={styles.header}>
          <img src={Logo} alt="logo" className={styles.logo} />
          <h2 className={styles.title}>SmartCommute</h2>
        </header>

        <h1 className={styles.pageTitle}>Login</h1>

        <main className="w-full">
          <label className={styles.label}>Enter your Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={styles.input}
            value={usernameInput}
            onChange={handleInputChange}
          />
          {errors.username && <p className={styles.errorText}>{errors.username}</p>}

          <label className={styles.label}>Enter your Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={handleInputChange}
          />
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}

          <div className={styles.forgetPasswordContainer}>
            <button onClick={handleForgetPasswordClick} className={styles.forgetPasswordButton}>
              Forget Password?
            </button>
          </div>

          <button onClick={handleLoginClick} className={styles.loginButton}>
            Login
          </button>

          <p className={styles.registerText}>
            New User?{' '}
            <button onClick={handleRegisterClick} className={styles.registerLink}>
              Register
            </button>
          </p>
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: "flex items-center justify-center h-screen bg-[#4169E1] overflow-hidden",
  alertContainer: "absolute top-0 left-0 right-0 p-4",
  card: "w-4/6 max-w-md bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center relative",
  backButton: "absolute top-4 left-4 flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 shadow transition duration-200",
  header: "mb-6 text-center relative w-full flex flex-col items-center",
  logo: "mb-4 h-48",
  title: "text-[#1D4ED8] text-3xl font-bold",
  pageTitle: "text-4xl font-bold text-[#1D4ED8] mb-6",
  label: "block text-gray-700 text-left mb-2 text-lg",
  input: "w-full mb-2 p-3 border border-gray-300 rounded-lg shadow-sm",
  errorText: "text-red-500 text-sm mb-2",
  forgetPasswordContainer: "text-right mb-6",
  forgetPasswordButton: "text-[#1D4ED8] font-bold text-sm cursor-pointer hover:underline",
  loginButton: "w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-[#1E40AF] hover:to-[#2563EB] transition duration-300 shadow-md hover:shadow-lg mb-4",
  registerText: "text-center text-gray-600",
  registerLink: "text-[#1D4ED8] font-bold cursor-pointer hover:underline",
};

export default LoginPage;
