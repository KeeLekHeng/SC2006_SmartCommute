import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from './components/Alert';

const MainApp = () => {
  const location = useLocation();
  
  // Initialize local state with alert information from location state
  const initialAlert = location.state?.alert || { show: false, message: '', type: '' };
  const [alert, setAlert] = useState(initialAlert);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  
  const closeAlert = () => {
    setAlert({ ...alert, show: false }); // Hide the alert
  };

  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  useEffect(() => {
    // If any alert comes in the location state, update the local state
    if (location.state?.alert) {
      setAlert(location.state.alert);
    }
  }, [location.state]);


  return (
    <div className="w-full bg-blue-100 min-h-screen">

      {/* Show the alert at the top of the screen */}
      {alert.show && (
        <div className="absolute top-0 left-0 right-0 p-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
        </div>
      )}

      {/* Collapsible Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 bg-blue-400 text-white shadow-md z-40 transition-all duration-300 ${
          isNavbarVisible ? 'h-16 opacity-100' : 'h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className={`transition-opacity duration-300 ${isNavbarVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* All Items in Nav bar */}
          <h1 className="mt-6 text-center">Welcome to the Main App!</h1>
        </div>
      </nav>

      {/* Toggle Button */}
      <button
        className="fixed top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded z-50"
        onClick={toggleNavbar}
      >
        {isNavbarVisible ? 'Hide Navbar' : 'Show Navbar'}
      </button>

      
      {/* Your Main App content goes here */}
      <div className="pt-32">
        <p className="text-center mt-8 text-lg">Main app content goes here.</p>
      </div>

      {/* Footer */}
      <div className="pt-16">
        <p className="fixed bottom-0 left-0 right-0 text-center bg-blue-400 py-2 mt-8 text-lg">Footer</p>
      </div>

    </div>
  );
};

export default MainApp;
