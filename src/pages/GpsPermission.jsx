import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import logo from '../assets/logo.png';
import mapImage from '../assets/gpsGeneric.png';
import Alert from '../components/Alert'; // Ensure the Alert component is imported

const GpsPermission = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Initialize useLocation

    // Extract the alert from location state if it exists
    const initialAlert = location.state?.alert || { show: false, message: '', type: '' };
    const [alert, setAlert] = useState(initialAlert);

    // Function to allow GPS
    const allowGps = () => {
        console.log("GPS Allowed");
        navigate('/search'); // Navigate to SearchPage after allowing GPS
    };

    // Function to deny GPS
    const denyGps = () => {
        console.log("GPS Denied");
        setAlert({ show: true, message: 'GPS must be allowed for normal service.', type: 'error' });
    };

    // Function to close the alert
    const closeAlert = () => {
        setAlert({ ...alert, show: false });
    };

    // Use effect to handle incoming alert from location state
    useEffect(() => {
        if (location.state?.alert) {
            setAlert(location.state.alert); // Set the alert if it exists in location.state
        }
    }, [location.state]);

    return (
        <div className="flex items-center justify-center h-screen bg-cyan-200 overflow-hidden">
            {/* Display alert if available */}
            {alert.show && (
                <div className="absolute top-0 left-0 right-0 p-4">
                    <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
                </div>
            )}

            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
                {/* Logo and title */}
                <header className="flex flex-col items-center space-y-4 mb-6">
                    <img src={logo} alt="SmartCommute logo" className="h-20 w-auto" />
                    <h1 className="text-3x1 font-bold text-green-700">SmartCommute</h1>
                    <h1 className="text-x1 font-semibold text-gray-800">GPS Permission</h1>
                </header>

                {/* GPS access prompt */}
                <main className="flex flex-col items-center text-center mb-8">
                    <p className="text-xl font-medium text-gray-600 mb-4">
                        Please allow GPS access to enhance your experience.
                    </p>
                    <div className="flex space-x-2 mb-6">
                        <button
                            className="bg-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-600 transition w-32"
                            onClick={allowGps}
                        >
                            Allow GPS
                        </button>
                        <button
                            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-400 transition w-32"
                            onClick={denyGps}
                        >
                            Don’t Allow
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

