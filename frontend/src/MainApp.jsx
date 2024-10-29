import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Routes, Route, Link } from "react-router-dom";
import Alert from './components/Alert';
import SearchPage from './pages/SearchPage';
import ReviewPage from './pages/ReviewPage';

const MainApp = () => {
  const location = useLocation();
  
  const initialAlert = location.state?.alert || { show: false, message: '', type: '' };
  const [alert, setAlert] = useState(initialAlert);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };


  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
    }
  }, [location.state]);

  return (
    <div className="w-full bg-blue-100 min-h-screen flex flex-col">

      {alert.show && (
        <div className="absolute top-0 left-0 right-0 p-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
        </div>
      )}

      <nav className={`fixed h-24 top-0 left-0 right-0 bg-blue-400 text-white shadow-md z-40 transition-all duration-300 overflow-hidden`}>
        <div className={'transition-opacity duration-300'}>
          <h1 className="mt-6 text-center">Welcome to the Main App!</h1>
        </div>
      </nav>

      <div className="pt-20 flex-1">
        <Routes>
          <Route path='/search' element={<SearchPage />} />
          <Route path='/' element={<SearchPage />} /> {/* Default route */}
          <Route path='/review' element={<ReviewPage />} />
        </Routes>
      </div>

      <footer className="bg-blue-400 text-center text-lg text-white py-2 fixed bottom-0 w-full z-30">
        <h3>Footer</h3>
        <Link to="/review" className="hover:underline">
          Leave us a review
        </Link>
        <span> www.smartcommutesg.com</span>
      </footer>

    </div>
  );
};

export default MainApp;
