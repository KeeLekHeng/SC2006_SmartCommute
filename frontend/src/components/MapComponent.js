import React from 'react';
import ntuMap from '../assets/ntu_map.png';

// Define the points on the map with coordinates and names
const mapPoints = [
  { name: "Yunnan Garden", x: 300, y: 250, postalCode: "637721" },
  { name: "Lee Wee Nam Library", x: 500, y: 100, postalCode: "639798" },
  { name: "The Hive", x: 550, y: 150, postalCode: "639816" },
  { name: "NTU Canteen 9", x: 420, y: 220, postalCode: "639798" },
  { name: "NTU Sports Centre", x: 450, y: 320, postalCode: "637800" }
];

const MapComponent = ({ onSelectLocation, isSelectingStart }) => {
  // Function to handle clicking on the map
  const handleMapClick = (point) => {
    onSelectLocation(point); // Pass the selected location up to the parent component
  };

  return (
    <div className="relative w-full h-96">
      {/* Display the map image */}
    <img 
        src={ntuMap} 
        alt="NTU Map" 
        className="w-full h-full object-cover rounded-lg" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
    />
    </div>
  );
};

export default MapComponent;