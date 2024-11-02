import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import boyAvatar from '../assets/boyAvatar.png';
import girlAvatar from '../assets/girlAvatar.png';

const avatars = {
  Male: boyAvatar,
  Female: girlAvatar,
};

const DisplayInfoPage = () => {
  const { user: username, gender } = useContext(UserContext); // Retrieve username and gender from UserContext
  const [userData, setUserData] = useState({
    username: username || '',
    gender: gender || 'Male',
  });

  const [tempUsername, setTempUsername] = useState(userData.username);
  const [tempGender, setTempGender] = useState(userData.gender);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState('');
  const navigate = useNavigate();

  const handleEditClick = (field) => {
    setEditField(field);
    if (field === 'username') {
      setTempUsername(userData.username);
    } else if (field === 'gender') {
      setTempGender(userData.gender);
    }
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editField === 'username') {
      setUserData((prevData) => ({ ...prevData, username: tempUsername }));
    } else if (editField === 'gender') {
      setUserData((prevData) => ({
        ...prevData,
        gender: tempGender,
        avatar: tempGender === 'Male' ? avatars.Male : avatars.Female,
      }));
    }
    setShowEditModal(false);
  };

  const handleNavigateToUpdatePassword = () => {
    navigate('/update-password', {
      state: { username: userData.username },
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put('http://localhost:4000/authRoutes/update-user', {
        username: userData.username,
        gender: userData.gender,
      });
      if (response.status === 200) {
        alert('User information updated successfully!');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      alert('Failed to update user information. Please try again.');
    }
  };

  return (
    <div className="bg-teal-500 flex justify-center items-center h-screen p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <img
            src={userData.gender === 'Male' ? avatars.Male : avatars.Female}
            alt="User Avatar"
            className="w-32 h-32 rounded-full mb-4 shadow-md"
          />
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="border border-gray-300 rounded-lg p-3 cursor-pointer" onClick={() => handleEditClick('username')}>
            <p className="text-sm font-semibold">Username:</p>
            <p className="text-lg mt-1">{userData.username}</p>
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

          <div className="border border-gray-300 rounded-lg p-3 cursor-pointer" onClick={() => handleEditClick('gender')}>
            <p className="text-sm font-semibold">Gender:</p>
            <p className="text-lg mt-1">{userData.gender}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSaveChanges}
            className="p-3 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition duration-300 shadow-md hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-80 shadow-lg">
              <h2 className="font-bold text-lg mb-4">Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}</h2>

              {editField === 'gender' ? (
                <select
                  value={tempGender}
                  onChange={(e) => setTempGender(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
              )}

              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowEditModal(false)} className="p-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleSaveEdit} className="p-2 bg-blue-500 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayInfoPage;
