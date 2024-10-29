import React, {useContext} from "react";
import logo from '../assets/logo.png'; 
import mapImage from '../assets/gpsGeneric.png'
import {useNavigate} from 'react-router-dom'
import  GpsRequest  from "../components/GpsRequest";
import  {GpsContext}  from '../context/GpsContext'; 

const GpsPermission = ({allowGps, denyGps}) => { 
    const { setGpsCoordinates } = useContext(GpsContext);
    const navigate = useNavigate()

    const handleAllowGps = (coords) => {
        console.log("GPS Allowed, Coordinates:", coords);
        navigate('/login'); 
    };

    const handleDenyGps = () => {
        console.log("GPS Denied");
        navigate('/login'); 
    };


    return (
        <div className = "flex items-center justify-center h-screen bg-cyan-200 overflow-hidden">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            {/*Logo and title*/}
            <header className="flex flex-col items-center space-y-4 mb-6">
                <img src={logo} alt="SmartCommue logo" className="h-20 w-auto" />
                <h1 className="text-3x1 font-bold text-green-700">SmartCommute</h1>
                <h1 className="text-x1 font-semibold text-gray-800">GPS Permission</h1>
            </header>   

            {/* GPS access prompt */}
            <main className="flex flex-col items-center text-center mb-8">
                    <p className="text-xl font-medium text-gray-600 mb-4">
                        Please allow GPS access to enhance your experience.
                    </p>
                    <div className="flex space-x-2 mb-6">
                        <GpsRequest onAllow={handleAllowGps} onDeny={handleDenyGps} />
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