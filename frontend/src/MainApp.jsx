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

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Clear timeout if component unmounts or alert changes
    }
  }, [alert]);

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: '#E8F0FA' }}> {/* Light Blue Gray Background */}

      {alert.show && (
        <div className="absolute top-0 left-0 right-0 p-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
        </div>
      )}

      <nav className="fixed h-24 top-0 left-0 right-0 bg-[#4169E1] text-white shadow-md z-40 transition-all duration-300 overflow-hidden"> {/* Royal Blue Header */}
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="w-18 h-14 mr-6" />
            <span className="text-2xl font-bold">SmartCommute</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <div className="flex flex-col items-center">
              <img src={home} alt="Home" className="w-14 h-14" />
              <Link to="/main" className="hover:underline text-lg font-semibold transition duration-300 pb-2 text-white">
                Home
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <img src={favourites} alt="Favourites" className="w-12 h-12 mb-2" />
              <Link to="/favourites" className="hover:underline text-lg font-semibold transition duration-300 pb-2 text-white">
                Favourites
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <img src={settings} alt="Settings" className="w-14 h-14" />
              <Link to="/settings" className="hover:underline text-lg font-semibold transition duration-300 pb-2 text-white">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content container that stretches to fill the space */}
      <div className="pt-24 pb-12 flex-1 flex">
        <Routes>
          <Route path='/search' element={<SearchPage />} />
          <Route path='/' element={<SearchPage />} /> {/* Default route */}
          <Route path='/review' element={<ReviewPage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/display' element={<DisplayInfoPage />} />
        </Routes>
      </div>

      <footer className="bg-[#4169E1] text-center text-lg text-white py-2 fixed bottom-0 w-full z-30"> {/* Royal Blue Footer */}
        <Link to="/review" className="hover:underline mb-1 text-white">
          <i className="material-icons text-yellow-500 mr-4">star</i>
          Leave us a review 
          <i className="material-icons text-yellow-500 ml-4">star</i>
        </Link>

        <span className="block mt-2 text-white"> www.smartcommutesg.com</span>
      </footer>
    </div>
  );
};

export default MainApp;
