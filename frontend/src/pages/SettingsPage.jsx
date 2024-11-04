import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import settings from '../assets/setttings.png';
import favourites from '../assets/fav.png';
import home from '../assets/home.png';
import Logo from '../assets/logo1.png';
import Alert from '../components/Alert';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const handleDisplayInfo = () => {
        navigate('/display');
    };

    const handleTravelHistory = () => {
        navigate('/searchHistory');
    };

    const handleLogout = () => {
        logout();

        localStorage.setItem('logoutSuccess', 'true');

        navigate('/', {
            state: { alert: { show: true, message: 'Logout successful!', type: 'success' } },
        });
    };

    return (
        <div className="flex flex-col h-screen" style={{ backgroundColor: '#F3F4F6' }}>
            
            {/* Header */}
            <nav className="fixed h-24 top-0 left-0 right-0 bg-[#4169E1] text-white shadow-md z-40 transition-all duration-300">
                <div className="flex items-center justify-between h-full px-4">
                    <div className="flex items-center"> 
                        <img src={Logo} alt="Logo" className="w-18 h-14 mr-6" />
                        <span className="text-2xl font-bold">SmartCommute</span>
                    </div>

                    <div className="flex space-x-44">
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

            {/* Content Section */}
            <div className="pt-28 flex-1 flex justify-center items-center px-4 pb-8">
                <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto">
                    <h1 className="text-center font-extrabold text-3xl mb-6">Settings</h1>

                    <div className="space-y-4">
                        <button 
                            onClick={handleDisplayInfo} 
                            className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg w-full flex items-center justify-center hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg mb-2"
                        >
                            Display Info
                        </button>
                        <button 
                            onClick={handleTravelHistory} 
                            className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg w-full flex items-center justify-center hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg mb-2"
                        >
                            Search History
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="p-3 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg w-full flex items-center justify-center hover:from-red-500 hover:to-red-700 transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Full-width Alert */}
            {alert.show && (
                <div className="fixed top-0 left-0 w-full z-50 flex justify-center mt-6">
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
                </div>
            )}

            {/* Footer */}
            <footer className="bg-[#4169E1] text-center text-lg text-white py-2 fixed bottom-0 w-full z-30">
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

export default SettingsPage;
