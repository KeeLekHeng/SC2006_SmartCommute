import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize state with values from localStorage if available
  const [user, setUser] = useState(localStorage.getItem('username') || '');
  const [gender, setGender] = useState(localStorage.getItem('gender') || '');

  const setUsername = async (username) => {
    if (username) {
      setUser(username);
      localStorage.setItem('username', username);

      try {
        // Ensure this route in your backend correctly returns user details, including gender
        const response = await axios.get(`http://localhost:4000/authRoutes/user/${username}`);
        
        if (response.status === 200 && response.data) {
          const { gender } = response.data; // Extract gender from response
          setGender(gender);
          localStorage.setItem('gender', gender); // Store gender in local storage
        } else {
          console.warn('No gender information found in the response');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    } else {
      // Clear user data when no username is provided
      setUser('');
      setGender('');
      localStorage.removeItem('username');
      localStorage.removeItem('gender');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUsername, gender }}>
      {children}
    </UserContext.Provider>
  );
};