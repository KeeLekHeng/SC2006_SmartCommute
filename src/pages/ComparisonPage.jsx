import React from 'react';
import { useLocation } from 'react-router-dom';

const ComparisonPage = () => {
  const location = useLocation();
  const { startLocation, destination } = location.state || {}; // Fallback in case state is not passed

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Comparison Page</h1>
      <div className="mt-6">
        <p className="text-lg">Start Location: {startLocation}</p>
        <p className="text-lg">Destination: {destination}</p>
      </div>
    </div>
  );
};

export default ComparisonPage;
