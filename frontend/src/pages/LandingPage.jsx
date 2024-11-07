import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import React, { useEffect, useState } from 'react';
import Alert from '../components/Alert';

const LandingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (location.state && location.state.alert) {
            setAlert(location.state.alert);
            setTimeout(() => {
                setAlert({ show: false });
            }, 5000);
        }
    }, [location.state]);

    const handleGetStarted = () => {
        navigate('/gps');
    };

    return (
        <div className={styles.container}>
            {/* Full-width Alert at the Top */}
            {alert.show && (
                <div className={styles.alertContainer}>
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
                </div>
            )}

            <div className={styles.card}>
                <header className={styles.header}>
                    <img src={logo} alt="logo" className={styles.logo} />
                    <h1 className={styles.title}>SmartCommute</h1>
                </header>

                <main className={styles.mainContent}>
                    <div className={styles.featuresCard}>
                        <h2 className={styles.featuresTitle}>Key Features</h2>
                        <ul className={styles.featuresList}>
                            <li className={styles.featureItem}>Real-Time Public Transport Data</li>
                            <li className={styles.featureItem}>Convenient Taxi Booking</li>
                            <li className={styles.featureItem}>Customized Commuting Recommendations</li>
                            <li className={styles.featureItem}>Economical Route Planning</li>
                        </ul>
                    </div>
                </main>

                <footer className={styles.footer}>
                    <button className={styles.getStartedButton} onClick={handleGetStarted}>
                        Get Started
                    </button>
                </footer>
            </div>
        </div>
    );
};

const styles = {
    container: "bg-[#4169E1] flex items-center justify-center h-screen relative",
    alertContainer: "fixed top-0 left-0 right-0 z-50",
    card: "w-11/12 max-w-lg bg-white shadow-lg rounded-lg p-6 mx-4 flex flex-col items-center",
    header: "flex flex-col items-center mb-6",
    logo: "mb-4 h-40 -ml-0.5",
    title: "text-[#1D4ED8] text-4xl font-bold text-center",
    mainContent: "w-full text-center mb-6",
    featuresCard: "bg-gray-100 shadow-md rounded-lg p-5",
    featuresTitle: "text-2xl font-bold text-blue-600 mb-4",
    featuresList: "space-y-4",
    featureItem: "text-lg text-gray-700 font-medium",
    footer: "w-full",
    getStartedButton: "w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md hover:shadow-lg",
};

export default LandingPage;
