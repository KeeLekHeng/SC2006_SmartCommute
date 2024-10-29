import { useState, useContext } from 'react';
import {GpsContext} from '../context/GpsContext';

const GpsRequest = ({ onAllow, onDeny }) => {
    const gpsContext = useContext(GpsContext);  // Get the whole context object
    const setGpsCoordinates = gpsContext ? gpsContext.setGpsCoordinates : null; // Guard

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const requestGPS = () => {
        
        //Restrictive browsers may not allow GPS connection
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            if (typeof onDeny === 'function') onDeny();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                setLatitude(coords.latitude);
                setLongitude(coords.longitude);

                if (setGpsCoordinates) {
                    setGpsCoordinates(coords); // Update context if available for global use
                }

                if (typeof onAllow === 'function') onAllow(coords);
            },
            (error) => {
                console.error("Error getting location: ", error);
                if (typeof onDeny === 'function') onDeny();
            }
        );
    };

    return (
        <div>
            <button
                className="bg-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-600 transition w-32"
                onClick={requestGPS} // Trigger function when Allow GPS is clicked
            >
                Allow 
            </button>
            <button
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-400 transition w-32"
                onClick={onDeny} // Trigger function when Don't Allow is clicked
            >
                Don’t Allow
            </button>
        </div>
    );
};

export default GpsRequest;
