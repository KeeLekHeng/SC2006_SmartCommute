import React, { useState, createContext } from 'react';

// Create context
export const GpsContext = createContext();

// Create provider
export const GpsProvider = ({ children }) => {
  const [gpsCoordinates, setGpsCoordinates] = useState(null);

  return (
    <GpsContext.Provider value={{ gpsCoordinates, setGpsCoordinates }}>
      {children}
    </GpsContext.Provider>
  );
};
