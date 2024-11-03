import React, { useContext } from "react";
import logo from '../assets/logo.png';
import mapImage from '../assets/gpsGeneric.png';
import { useNavigate } from 'react-router-dom';
import { GpsContext } from '../context/GpsContext';

const GpsPermission = () => {
  const { setGpsCoordinates } = useContext(GpsContext);
  const navigate = useNavigate();

  const handleAllowGps = (coords) => {
    console.log("GPS Allowed, Coordinates:", coords);
    navigate('/login');
  };

  const handleDenyGps = () => {
    console.log("GPS Denied");
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-teal-400 to-teal-600 overflow-hidden">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        {/* Logo and Title */}
        <header className="flex flex-col items-center space-y-4 mb-6">
          <img src={logo} alt="SmartCommute logo" className="h-20 w-auto" />
          <h1 className="text-3xl font-bold text-green-700">SmartCommute</h1>
          <h1 className="text-xl font-semibold text-gray-800">GPS Permission</h1>
        </header>

        {/* GPS Access Prompt */}
        <main className="flex flex-col items-center text-center mb-8">
          <p className="text-lg font-medium text-gray-600 mb-4">
            Please allow GPS access to enhance your experience.
          </p>
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => handleAllowGps()}
              className="w-40 px-4 py-3 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 transition duration-300 shadow-md"
            >
              Allow
            </button>
            <button
              onClick={() => handleDenyGps()}
              className="w-40 px-4 py-3 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500 transition duration-300 shadow-md"
            >
              Don't Allow
            </button>
          </div>
        </main>

        {/* Map Image */}
        <div className="w-full max-w-sm rounded-lg shadow-md overflow-hidden">
          <img src={mapImage} alt="Map" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default GpsPermission;
