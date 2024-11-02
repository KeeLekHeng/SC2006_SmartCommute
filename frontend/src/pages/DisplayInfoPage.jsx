import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import boyAvatar from '../assets/boyAvatar.png';
import girlAvatar from '../assets/girlAvatar.png';

const avatars = {
  Male: boyAvatar,
  Female: girlAvatar,
};

const DisplayInfoPage = () => {
  const { user: username, gender } = useContext(UserContext); // Retrieve username and gender from UserContext
  const navigate = useNavigate();

  const handleNavigateToUpdatePassword = () => {
    navigate('/update-password', {
      state: { username },
    });
  };

  return (
    <div className="bg-teal-500 flex justify-center items-center h-screen p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto">
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
  );
};

export default DisplayInfoPage;
