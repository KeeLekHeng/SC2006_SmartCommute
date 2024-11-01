import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import boyAvatar from '../assets/boyAvatar.png';
import girlAvatar from '../assets/girlAvatar.png';

const avatars = {
    boy: boyAvatar,
    girl: girlAvatar,
};

const EnterDetailsPage = () => {
    const location = useLocation(); 
    const [selectedGender, setSelectedGender] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const { username, password, email } = location.state || {};
    const navigate = useNavigate();

    const handleGenderSelect = (gender) => {
        setSelectedGender(gender);
    };

    const handleSubmit = async () =>  {
        if (!selectedGender || !securityAnswer) {
            alert('Please select a gender and answer the security question.');
            return;
        }
        const sgTime = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });
        try {
            const response = await axios.post('http://localhost:4000/authRoutes/register', {
                username,
                password,
                email,
                gender: selectedGender,
                security: securityAnswer,
                timestamp: sgTime
            });
    
            if (response.status === 201) {
                alert('Registration successful!');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="bg-teal-500 flex justify-center items-center h-screen p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md h-full max-h-[90vh] shadow-lg overflow-y-auto">
                {/* Display the username */}
                {username && (
                    <h2 className="text-center text-xl font-semibold mb-4 text-gray-700">
                        Hello, {username}
                    </h2>
                )}
                <div className="flex items-center justify-center mb-6">
                    {selectedGender && (
                        <img
                            src={selectedGender === 'male' ? avatars.boy : avatars.girl}
                            alt="Selected Avatar"
                            className="w-32 h-32 rounded-full shadow-md"
                        />
                    )}
                </div>
                <h1 className="font-bold text-center text-gray-700 mb-6 text-lg">Select Your Gender</h1>
                <div className="flex space-x-4 justify-center mb-6">
                    <button
                        onClick={() => handleGenderSelect('male')}
                        className={`p-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition duration-300 shadow-md ${
                            selectedGender === 'male' ? 'ring-4 ring-blue-300' : ''
                        }`}
                    >
                        Male
                    </button>
                    <button
                        onClick={() => handleGenderSelect('female')}
                        className={`p-3 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-lg hover:from-pink-500 hover:to-pink-700 transition duration-300 shadow-md ${
                            selectedGender === 'female' ? 'ring-4 ring-pink-300' : ''
                        }`}
                    >
                        Female
                    </button>
                </div>
                <label className="block text-gray-700 text-lg font-medium mb-2">
                    What is the name of your last pet?
                </label>
                <input
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-6"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full p-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition duration-300 shadow-md"
                >
                    Enter
                </button>
            </div>
        </div>
    );
};

export default EnterDetailsPage;
