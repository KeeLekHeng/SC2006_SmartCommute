import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import boyAvatar from '../assets/boyAvatar.png';
import girlAvatar from '../assets/girlAvatar.png';
import settings from '../assets/setttings.png';
import favourites from '../assets/fav.png';
import home from '../assets/home.png';
import Logo from '../assets/logo1.png';

const avatars = {
  Male: boyAvatar,
  Female: girlAvatar,
};

const DisplayInfoPage = () => {
  const { user: username, gender } = useContext(UserContext);
  const navigate = useNavigate();

  const handleNavigateToUpdatePassword = () => {
    navigate('/update-password', {
      state: { username },
    });
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#E8F0FA' }}> {/* Light Blue Gray Background */}
      
      {/* Header */}
      <nav className="fixed h-24 top-0 left-0 right-0 bg-[#4169E1] text-white shadow-md z-40 transition-all duration-300"> {/* Royal Blue Header */}
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
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto relative">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 shadow transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex flex-col items-center mb-6">
            <img
              src={gender === 'male' ? avatars.Male : avatars.Female}
              alt="User Avatar"
              className="w-32 h-32 rounded-full mb-4 shadow-md"
            />
          </div>

          <div className="space-y-4 text-gray-700">
            <div className="border border-gray-300 rounded-lg p-3">
              <p className="text-sm font-semibold">Username:</p>
              <p className="text-lg mt-1">{username}</p>
            </div>

            <div className="border border-gray-300 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Password:</p>
                <p className="text-lg mt-1">********</p>
              </div>
              <span
                className="text-sm text-blue-500 cursor-pointer hover:underline"
                onClick={handleNavigateToUpdatePassword}
              >
                Change Password
              </span>
            </div>

            <div className="border border-gray-300 rounded-lg p-3">
              <p className="text-sm font-semibold">Gender:</p>
              <p className="text-lg mt-1">{gender}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#4169E1] text-center text-lg text-white py-2 fixed bottom-0 w-full z-30"> {/* Royal Blue Footer */}
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

export default DisplayInfoPage;
