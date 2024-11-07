import React, { useContext, useState } from "react";
import logo from '../assets/logo.png';
import mapImage from '../assets/gpsGeneric.png';
import { useNavigate } from 'react-router-dom';
import { GpsContext } from '../context/GpsContext';

const GpsPermission = () => {
  const { setGpsCoordinates } = useContext(GpsContext);
  const navigate = useNavigate();
  const [userCoordinates, setUserCoordinates] = useState(null);

  const handleAllowGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserCoordinates(userLatLng);
          setGpsCoordinates(userLatLng);
          console.log("GPS Allowed, Coordinates:", userLatLng);
          navigate('/login');
        },
        (error) => {
          console.error('Error getting user location:', error);
          alert("Unable to access GPS. Please ensure your browser permissions allow GPS access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleDenyGps = () => {
    console.log("GPS Denied");
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <img src={logo} alt="SmartCommute logo" className={styles.logo} />
          <h1 className={styles.title}>SmartCommute</h1>
          <h2 className={styles.subtitle}>GPS Permission</h2>
        </header>

        <main className={styles.mainContent}>
          <p className={styles.prompt}>Please allow GPS access to enhance your experience.</p>
          <div className={styles.buttonGroup}>
            <button onClick={handleAllowGps} className={`${styles.button} ${styles.allowButton}`}>
              Allow
            </button>
            <button onClick={handleDenyGps} className={`${styles.button} ${styles.denyButton}`}>
              Don't Allow
            </button>
          </div>
        </main>

        <div className={styles.mapContainer}>
          <img src={mapImage} alt="Map" className={styles.mapImage} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: "flex items-center justify-center h-screen bg-[#4169E1] overflow-hidden",
  card: "bg-white w-full max-w-md rounded-lg shadow-lg p-6",
  header: "flex flex-col items-center space-y-4 mb-6",
  logo: "h-20 w-auto",
  title: "text-3xl font-bold text-green-700",
  subtitle: "text-xl font-semibold text-gray-800",
  mainContent: "flex flex-col items-center text-center mb-8",
  prompt: "text-lg font-medium text-gray-600 mb-4",
  buttonGroup: "flex space-x-2 mb-6",
  button: "w-40 px-4 py-3 rounded-lg font-bold transition duration-300 shadow-md",
  allowButton: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
  denyButton: "bg-gray-400 text-white hover:bg-gray-500",
  mapContainer: "w-full max-w-sm rounded-lg shadow-md overflow-hidden",
  mapImage: "w-full",
};

export default GpsPermission;
