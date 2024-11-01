import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [gender, setGender] = useState('');

  const setUsername = async (username) => {
    if (username) {
      setUser(username);
      localStorage.setItem('username', username);

      try {
        const response = await axios.get(`http://localhost:4000/authRoutes/user/${username}`);
        
        if (response.status === 200 && response.data) {
          const { gender } = response.data;
          setGender(gender);
          localStorage.setItem('gender', gender); // Store gender in local storage
        }
      } catch (error) {
        console.error('Error fetching user gender:', error);
      }
    } else {
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
