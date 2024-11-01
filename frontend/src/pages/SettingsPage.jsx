import React from "react";
import { useNavigate } from "react-router-dom";
import boyAvatar from '../assets/boyAvatar.png'
import girlAvatar from '../assets/girlAvatar.png'

const avatars = {
    boy: boyAvatar, girl: girlAvatar,
}; 

const User = { 
    username: "Thuva", avatar: avatars.boy,
}

const SettingsPage = () => { 
    const navigate = useNavigate(); 

    const handleDisplayInfo = () => { 
        alert("Displaying user information..," ); 
        navigate('/display')
    }; 

    const handleTravelHistory = () => { 
        alert("Navigating to Travel History..."); 
        navigate('/searchHistory');
    }; 

    const handleLogout = () => { 
        alert("Logging out..."); 
        //clear backend storage
        navigate('/login');
    };

    return (
        <div className="bg-teal-500 flex justify-center items-center h-screen p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md h-full max-h-[90vh] shadow-lg overflow-y-auto">
                {/*username*/}
                <div className="flex items-center mb-6">
                    <img src={User.avatar} alt="User Avatar" className="w-14 h-14 rounded-full mr-4 shadow-md" />
                    <p className="font-bold text-xl text-gray-700">{User.username}</p>
                </div>

                <h1 className="font-bold text-center text-gray-700 mb-6 text-lg">Settings</h1>

                <div className="space-y-4">
                    <button onClick={handleDisplayInfo} className="p-3 bg-gradient-to-r from-blue-400 to-blue-p-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg w-full flex items-center justify-center hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg600 rounded w-full mb-2">
                        Display Info
                    </button>
                    <button onClick={handleTravelHistory} className="p-3 bg-gradient-to-r from-blue-400 to-blue-p-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg w-full flex items-center justify-center hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-lg600 rounded w-full mb-2">
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

<<<<<<< HEAD
export default SettingsPage; 
=======
export default SettingsPage; 
>>>>>>> 8d9b1e00cfb4693dbf3a5c352a3d634a66316ee3
