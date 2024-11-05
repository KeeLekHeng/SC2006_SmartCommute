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
        <div className={styles.container} style={{ backgroundColor: '#F3F4F6' }}>
            {/* Header */}
            <nav className={styles.header}>
                <div className={styles.headerContent}>
                    <div className="flex items-center">
                        <img src={Logo} alt="Logo" className={styles.logo} />
                        <span className="text-2xl font-bold">SmartCommute</span>
                    </div>
                    <div className="flex space-x-44">
                        <div className={styles.navItem}>
                            <img src={home} alt="Home" className="w-14 h-14" />
                            <Link to="/main" className={styles.navLink}>
                                Home
                            </Link>
                        </div>
                        <div className={styles.navItem}>
                            <img src={favourites} alt="Favourites" className="w-12 h-12 mb-2" />
                            <Link to="/favourites" className={styles.navLink}>
                                Favourites
                            </Link>
                        </div>
                        <div className={styles.navItem}>
                            <img src={settings} alt="Settings" className="w-14 h-14" />
                            <Link to="/settings" className={styles.navLink}>
                                Settings
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content Section */}
            <div className={styles.mainContent}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Settings</h1>
                    <div className="space-y-4">
                        <button 
                            onClick={handleDisplayInfo} 
                            className={`${styles.button} ${styles.buttonPrimary}`}
                        >
                            Display Info
                        </button>
                        <button 
                            onClick={handleTravelHistory} 
                            className={`${styles.button} ${styles.buttonPrimary}`}
                        >
                            Search History
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className={`${styles.button} ${styles.buttonDanger}`}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Full-width Alert */}
            {alert.show && (
                <div className={styles.alertContainer}>
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
                </div>
            )}

            {/* Footer */}
            <footer className={styles.footer}>
                <Link to="/review" className={styles.footerLink}>
                    <i className="material-icons text-yellow-500 mr-4">star</i>
                    Leave us a review 
                    <i className="material-icons text-yellow-500 ml-4">star</i>
                </Link>
                <span className="block mt-2 text-white"> www.smartcommutesg.com</span>
            </footer>
        </div>
    );
};

const styles = {
    container: "flex flex-col h-screen",
    header: "fixed h-24 top-0 left-0 right-0 bg-[#4169E1] text-white shadow-md z-40 transition-all duration-300",
    headerContent: "flex items-center justify-between h-full px-4",
    logo: "w-18 h-14 mr-6",
    navItem: "flex flex-col items-center",
    navLink: "hover:underline text-lg font-semibold transition duration-300 pb-2 text-white",
    mainContent: "pt-28 flex-1 flex justify-center items-center px-4 pb-8",
    card: "bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto",
    title: "text-center font-extrabold text-3xl mb-6",
    button: "p-3 rounded-lg w-full flex items-center justify-center transition duration-300 shadow-md hover:shadow-lg mb-2",
    buttonPrimary: "bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700",
    buttonDanger: "bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700",
    alertContainer: "fixed top-0 left-0 w-full z-50 flex justify-center mt-6",
    footer: "bg-[#4169E1] text-center text-lg text-white py-2 fixed bottom-0 w-full z-30",
    footerLink: "hover:underline mb-1 text-white",
};

export default SettingsPage;
