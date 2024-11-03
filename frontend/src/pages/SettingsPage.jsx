import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext); // Destructure logout from context

    const handleDisplayInfo = () => {
        navigate('/display');
    };

    const handleTravelHistory = () => {
        navigate('/searchHistory');
    };

    const handleLogout = () => {
        logout(); // Call the logout function to clear user data
        navigate('/');
    };

    return (
        <div className="bg-teal-500 flex justify-center items-center h-screen p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md h-full max-h-[90vh] shadow-lg overflow-y-auto">
                <h1 className="text-center font-extrabold text-3xl mb-6">Settings</h1>

                <div className="space-y-4">
                    <button onClick={handleDisplayInfo} className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg w-full flex items-center justify-center hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg mb-2">
                        Display Info
                    </button>
                    <button onClick={handleTravelHistory} className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg w-full flex items-center justify-center hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg mb-2">
                        Travel History
                    </button>
                    <button onClick={handleLogout} className="p-3 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg w-full flex items-center justify-center hover:from-red-500 hover:to-red-700 transition duration-300 shadow-md hover:shadow-lg">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
