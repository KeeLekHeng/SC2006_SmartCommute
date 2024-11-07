import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logo.png';
import Alert from '../components/Alert';

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';

  const [email, setEmail] = useState('');
  const [fruit, setFruit] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fruitError, setFruitError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [successAlert, setSuccessAlert] = useState({ show: false, message: '', type: 'success' });

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
    setEmailError('');
    setFruitError('');
    setPasswordError('');
    setAlert({ show: false, message: '', type: '' });
    setSuccessAlert({ show: false, message: '', type: 'success' });

    let hasError = false;

    if (!email) {
      setEmailError('Please fill in the email field.');
      hasError = true;
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setEmailError("Invalid email format.");
      hasError = true;
    }

    if (!fruit) {
      setFruitError('Please fill in the favorite fruit field.');
      hasError = true;
    }

    if (!newPassword) {
      setPasswordError('Please fill in the new password field.');
      hasError = true;
    } else if (!validatePassword(newPassword)) {
      hasError = true;
    }

    if (hasError) return;

    try {
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
      const errorMessage = error.response?.data.error || 'User Not Found, Please Try Again.';
      if (errorMessage.toLowerCase().includes('email')) setEmailError(errorMessage);
      else if (errorMessage.toLowerCase().includes('security')) setFruitError('Wrong answer to the security question.');
      else setAlert({ show: true, message: 'An error occurred. Please try again.', type: 'error' });
    }
  };

  const closeAlert = () => setAlert({ ...alert, show: false });
  const closeSuccessAlert = () => setSuccessAlert({ ...successAlert, show: false });

  return (
    <div className={styles.container}>
      {successAlert.show && (
        <div className={styles.alert}>
          <div className={`${styles.alertContent} bg-green-200 text-green-800`}>
            <span className={styles.alertMessage}>{successAlert.message}</span>
            <button onClick={closeSuccessAlert} className={styles.alertClose}>&times;</button>
          </div>
        </div>
      )}

      {alert.show && (
        <div className={styles.alert}>
          <div className={`${styles.alertContent} ${alert.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            <span className={styles.alertMessage}>{alert.message}</span>
            <button onClick={closeAlert} className={styles.alertClose}>&times;</button>
          </div>
        </div>
      )}

      <div className={styles.formCard}>
        <header className={styles.header}>
          <img src={Logo} alt="logo" className={styles.logo} />
          <h2 className={styles.logoText}>SmartCommute</h2>
        </header>

        <h1 className={styles.title}>Change Password</h1>

        <main className={styles.form}>
          <label className={styles.label}>Enter your Email</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
          {emailError && <p className={styles.error}>{emailError}</p>}

          <label className={styles.label}>What is your favorite fruit?</label>
          <input type="text" placeholder="Favorite Fruit" value={fruit} onChange={(e) => setFruit(e.target.value)} className={styles.input} />
          {fruitError && <p className={styles.error}>{fruitError}</p>}

          <label className={styles.label}>New Password</label>
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={styles.input} />
          {passwordError && <p className={styles.error}>{passwordError}</p>}

          <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleSendClick}>Reset Password</button>

          <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => navigate('/settings')}>Back to Settings</button>
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: "bg-[#4169E1] flex items-center justify-center h-screen overflow-hidden relative",
  alert: "absolute top-0 left-0 right-0 w-full",
  alertContent: "p-4 text-center shadow-md flex justify-between items-center",
  alertMessage: "flex-1 font-semibold",
  alertClose: "text-lg font-bold px-4",
  formCard: "w-11/12 max-w-md bg-white shadow-lg rounded-lg p-8 mx-4 flex flex-col items-center",
  header: "mb-6 text-center",
  logo: "mb-4 h-40",
  logoText: "text-[#1D4ED8] text-3xl font-bold",
  title: "text-4xl font-bold text-[#1D4ED8] mb-6",
  form: "w-full",
  label: "block text-gray-700 text-left mb-2 text-lg",
  input: "w-full mb-1 p-3 border border-gray-300 rounded-lg",
  error: "text-red-500 text-sm mb-4",
  button: "w-full py-3 px-6 rounded-lg font-bold text-lg transition duration-300 shadow-md hover:shadow-lg",
  buttonPrimary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-[#1E40AF] hover:to-[#2563EB] mb-4",
  buttonSecondary: "bg-gray-300 text-[#1D4ED8] hover:bg-gray-400",
};

export default UpdatePasswordPage;
