import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Alert from '../components/Alert';

const LoginPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const initialAlert = location.state?.alert || { show: false, message: '', type: '' };
  const [alert, setAlert] = useState(initialAlert);

  
  const handleLoginClick = () => {

    const isSuccess = true;       //BACKEND LOGIC NEEDED HERE

    if(isSuccess){
      setAlert({show:true, message:"Login Succesful!", type:"success"});
      navigate('/settings', { state: { alert: { show: true, message: 'Login successful!', type: 'success' } } }); 
    } else {
      setAlert({show:true, message:"User Not Found, Please Try Again.", type:"error"});
    }
  }
    
  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to the register page
  };
    
  const closeAlert = () => {
    setAlert({ ...alert, show: false }); // Hide the alert
  };

  useEffect(() => {
    // If an alert comes in the location state, update the local state
    if (location.state?.alert) {
      setAlert(location.state.alert);
    }
  }, [location.state]);

  

  return (
    <div className="flex items-center justify-center h-screen bg-cyan-200 overflow-hidden">
      
      {/* Show alert if it is visible */}
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
          <input type="text" placeholder="Username" className="w-full mb-4 p-3 border border-gray-300 rounded-lg" />

          <label className="block text-gray-700 text-left mb-2 text-lg">Enter your Password</label>
          <input type="password" placeholder="Password" className="w-full mb-6 p-3 border border-gray-300 rounded-lg" />

          <button
            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-teal-600 transition mb-4"
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
