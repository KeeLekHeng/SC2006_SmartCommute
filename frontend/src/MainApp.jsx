import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route, Link } from 'react-router-dom';
import Alert from './components/Alert';
import SearchPage from './pages/SearchPage';
import ReviewPage from './pages/ReviewPage';
import SettingsPage from './pages/SettingsPage';
import DisplayInfoPage from './pages/DisplayInfoPage';
import settings from './assets/setttings.png';
import favourites from './assets/fav.png';
import home from './assets/home.png';
import Logo from './assets/logo1.png';

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
    <div className="min-h-screen flex flex-col bg-blue-100">
      {/* Alert */}
      {alert.show && (
        <div className="absolute top-0 left-0 right-0 p-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
        </div>
      )}

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-400 text-white shadow-md z-50 py-4">
        <div className="flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="w-18 h-14 mr-6" />
            <span className="text-2xl font-bold">SmartCommute</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <div className="flex flex-col items-center">
              <img src={home} alt="Home" className="w-14 h-14" />
              <Link to="/main" className="hover:underline text-lg font-semibold">Home</Link>
            </div>
            <div className="flex flex-col items-center">
              <img src={favourites} alt="Favourites" className="w-12 h-12 mb-2" />
              <Link to="/favourites" className="hover:underline text-lg font-semibold">Favourites</Link>
            </div>
            <div className="flex flex-col items-center">
              <img src={settings} alt="Settings" className="w-14 h-14" />
              <Link to="/settings" className="hover:underline text-lg font-semibold">Settings</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 pt-24 pb-20">
        <Routes>
          <Route path='/search' element={<SearchPage />} />
          <Route path='/' element={<SearchPage />} /> {/* Default route */}
          <Route path='/review' element={<ReviewPage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/display' element={<DisplayInfoPage />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-blue-400 text-white py-4 text-center fixed bottom-0 left-0 right-0">
        <Link to="/review" className="hover:underline mb-1">
          Leave us a review
        </Link>
        <span className="block mt-2">www.smartcommutesg.com</span>
      </footer>
    </div>
  );
};

export default MainApp;
