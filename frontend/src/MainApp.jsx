import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Routes, Route, Link } from "react-router-dom";
import Alert from './components/Alert';
import SearchPage from './pages/SearchPage';
import ReviewPage from './pages/ReviewPage';
import SettingsPage from './pages/SettingsPage';
import DisplayInfoPage from './pages/DisplayInfoPage';
import settings from './assets/setttings.png'
import favourites from './assets/fav.png'
import home from './assets/home.png'
import Logo from './assets/logo1.png'

const MainApp = () => {
  const location = useLocation();
  
  const initialAlert = location.state?.alert || { show: false, message: '', type: '' };
  const [alert, setAlert] = useState(initialAlert);

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
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="w-18 h-14 mr-6" /> {/* Adjust size as needed */}
            <span className="text-2xl font-bold">SmartCommute</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-44">
            <div className="flex flex-col items-center">
              <img src={home} alt="Home" className="w-14 h-14" /> 
              <Link to="/main" className="hover:underline text-lg font-semibold transition duration-300 pb-2">
                Home
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <img src={favourites} alt="Favourites" className="w-12 h-12 mb-2"  /> 
              <Link to="/favourites" className="hover:underline text-lg font-semibold transition duration-300 pb-2">
                Favourites
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <img src={settings} alt="Settings" className="w-14 h-14" /> 
              <Link to="/settings" className="hover:underline text-lg font-semibold transition duration-300 pb-2">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>


      <div className="pt-20 flex-1">
        <Routes>
          <Route path='/search' element={<SearchPage />} />
          <Route path='/' element={<SearchPage />} /> {/* Default route */}
          <Route path='/review' element={<ReviewPage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/display' element={<DisplayInfoPage />} />

        </Routes>
      </div>

      <footer className="bg-blue-400 text-center text-lg text-white py-2 fixed bottom-0 w-full z-30">
        <Link to="/review" className="hover:underline mb-1">
          <i className="material-icons text-yellow-500 mr-4">star</i>
          Leave us a review 
          <i className="material-icons text-yellow-500 ml-4">star</i>
        </Link>

        <span className="block mt-2"> www.smartcommutesg.com</span>
      </footer>

    </div>
  );
};

export default MainApp;
