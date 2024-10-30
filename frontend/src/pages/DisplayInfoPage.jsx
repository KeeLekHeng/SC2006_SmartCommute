import React, { useState } from 'react';
import boyAvatar from '../assets/boyAvatar.png';
import girlAvatar from '../assets/girlAvatar.png';

const avatars = {
  boy: boyAvatar,
  girl: girlAvatar,
};

const initialUser = {
  username: "Thuva",
  password: "********", // Masked for display
  gender: "Male",
  avatar: avatars.boy,
};

const DisplayInfoPage = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState('');

  // User data state
  const [userData, setUserData] = useState(initialUser);

  // Individual temporary storage for each field
  const [tempUsername, setTempUsername] = useState(userData.username);
  const [tempPassword, setTempPassword] = useState('');
  const [tempGender, setTempGender] = useState(userData.gender);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEditClick = (field) => {
    setEditField(field);
    setErrorMessage('');
    setConfirmPassword('');
    // Initialize temporary values based on the field being edited
    if (field === 'username') {
      setTempUsername(userData.username);
    } else if (field === 'password') {
      setTempPassword('');
    } else if (field === 'gender') {
      setTempGender(userData.gender);
    }
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editField === 'password') {
      if (tempPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      setUserData({ ...userData, password: tempPassword });
    } else if (editField === 'gender') {
      const newAvatar = tempGender === "Male" ? avatars.boy : avatars.girl;
      setUserData({ ...userData, gender: tempGender, avatar: newAvatar });
    } else if (editField === 'username') {
      setUserData({ ...userData, username: tempUsername });
    }
    setShowEditModal(false);
  };

  const handleDeleteAccount = () => {
    alert("Account deleted. All data lost.");
    // Replace with actual deletion logic
  };

  return (
    <div className="bg-teal-500 flex justify-center items-center h-screen p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img src={userData.avatar} alt="User Avatar" className="w-32 h-32 rounded-full mb-4 shadow-md" />
        </div>

        {/* User Info Fields */}
        <div className="space-y-4 text-gray-700">
          <div>
            <p className="text-sm font-semibold">Username:</p>
            <p className="text-lg mb-1 cursor-pointer" onClick={() => handleEditClick('username')}>{userData.username}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">Password:</p>
            <p className="text-lg mb-1 cursor-pointer" onClick={() => handleEditClick('password')}>{userData.password}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">Gender:</p>
            <p className="text-lg mb-1 cursor-pointer" onClick={() => handleEditClick('gender')}>{userData.gender}</p>
          </div>
        </div>

        {/* Delete Account Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => alert("Are you sure you want to delete this account?")}
            className="p-3 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 transition duration-300 shadow-md hover:shadow-lg"
          >
            Delete Account
          </button>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-80 shadow-lg">
              <h2 className="font-bold text-lg mb-4">Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}</h2>
              
              {editField === 'gender' ? (
                // Gender Selection
                <select
                  value={tempGender}
                  onChange={(e) => {
                    setTempGender(e.target.value);
                    // Immediately show the selected avatar
                    setUserData({ ...userData, avatar: e.target.value === "Male" ? avatars.boy : avatars.girl });
                  }}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : editField === 'password' ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter new password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                  />
                  <input
                    type="text"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                  />
                </>
              ) : (
                // Input for Username
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
              )}

              {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}

              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowEditModal(false)} className="p-2 bg-gray-300 rounded">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="p-2 bg-blue-500 text-white rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayInfoPage;