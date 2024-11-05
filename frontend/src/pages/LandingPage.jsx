import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import React, { useEffect, useState } from 'react';
import Alert from '../components/Alert';

const LandingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        // Check for alert state passed via location
        if (location.state && location.state.alert) {
            setAlert(location.state.alert);

            // Clear the alert after a few seconds
            setTimeout(() => {
                setAlert({ show: false });
            }, 5000); // Adjust the timeout duration as needed
        }
    }, [location.state]);

    const handleGetStarted = () => {
        navigate('/gps'); // Navigate to the GPS page
    };

    return (
        <div className="bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center h-screen relative">
            {/* Full-width Alert at the Top */}
            {alert.show && (
                <div className="fixed top-0 left-0 right-0 z-50">
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
                </div>
            )}

            <div className="w-11/12 max-w-lg bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col items-center">
                <header className="flex flex-col items-center mb-6">
                    <img src={logo} alt="logo" className="mb-4 h-40 -ml-0.5" />
                    <h1 className="text-teal-700 text-4xl font-bold text-center">SmartCommute</h1>
                </header>

                <main className="w-full text-center mb-6">
                    <div className="bg-gray-100 shadow-md rounded-lg p-5">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">Key Features</h2>
                        <ul className="space-y-4">
                            <li className="text-lg text-gray-700 font-medium">Real-Time Public Transport Data</li>
                            <li className="text-lg text-gray-700 font-medium">Convenient Taxi Booking</li>
                            <li className="text-lg text-gray-700 font-medium">Customized Commuting Recommendations</li>
                            <li className="text-lg text-gray-700 font-medium">Economical Route Planning</li>
                        </ul>
                    </div>
                </main>

                <footer className="w-full">
                    <button
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md hover:shadow-lg"
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
