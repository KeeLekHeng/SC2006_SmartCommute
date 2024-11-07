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
        setAlert({ show: true, message: data.message, type: 'success' });
      } else {
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
    <div className={styles.container}>
      <div className={styles.alertContainer}>
        {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
      </div>

      <div className={styles.card}>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.backIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <header className={styles.header}>
          <img src={Logo} alt="logo" className={styles.logo} />
          <h2 className={styles.headerText}>SmartCommute</h2>
        </header>

        <h1 className={styles.title}>Forget Password</h1>

        <main className={styles.mainContent}>
          <label className={styles.label}>Enter your Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
            className={styles.input}
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}

          <label className={styles.label}>Answer Security Question (Favorite Fruit)</label>
          <input
            type="text"
            name="fruits"
            placeholder="Favorite Fruit"
            value={fruits}
            onChange={handleInputChange}
            className={styles.input}
          />
          {errors.fruits && <p className={styles.errorText}>{errors.fruits}</p>}

          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={handleSendClick}
          >
            Change to Default Password
          </button>

          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={handleBackToLogin}
          >
            Back to Login
          </button>
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: "flex items-center justify-center h-screen bg-[#4169E1] overflow-hidden",
  alertContainer: "absolute top-0 left-0 right-0 p-4",
  card: "w-11/12 max-w-lg bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center relative",
  backButton: "absolute top-4 left-4 flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 shadow transition duration-200",
  backIcon: "h-5 w-5 mr-2",
  header: "mb-6 text-center",
  logo: "mb-4 h-40",
  headerText: "text-[#1D4ED8] text-3xl font-bold",
  title: "text-4xl font-bold text-[#1D4ED8] mb-6",
  mainContent: "w-full",
  label: "block text-gray-700 text-left mb-2 text-lg",
  input: "w-full mb-3 p-3 border border-gray-300 rounded-lg shadow-sm",
  errorText: "text-red-500 text-sm mb-3",
  button: "w-full py-3 px-6 rounded-lg font-bold text-lg transition duration-300 shadow-md hover:shadow-lg mb-4",
  primaryButton: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-[#1E40AF] hover:to-[#2563EB]",
  secondaryButton: "bg-gray-300 text-[#1D4ED8] hover:bg-gray-400",
};

export default ForgetPasswordPage;
