import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert'; // Import the Alert component
import MapComponent from '../components/MapComponent'; // Import the map component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const locations = [
  { name: "Lee Wee Nam Library", postalCode: "639798" },
  { name: "The Hive", postalCode: "639816" },
  { name: "College of Computing and Data Science", postalCode: "639798" },
  { name: "Yunnan Garden", postalCode: "637721" },
  { name: "Jurong Point", postalCode: "648886" },
  { name: "Pioneer Mall", postalCode: "640638" },
  { name: "NTU Canteen 9", postalCode: "639798" },
  { name: "NTU Sports Centre", postalCode: "637800" }
];

// Frequently used and favorite locations picked from locations
const frequentlyUsedLocations = [
  locations[0], // Lee Wee Nam Library
  locations[1], // The Hive
];
const favoriteLocation = locations[2]; // College of Computing and Data Science

const SearchPage = () => {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [focusedInput, setFocusedInput] = useState(null); // Manage focus for both start and destination inputs
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const navigate = useNavigate();

  // Filter suggestions based on user input
  const filterSuggestions = (input) => {
    if (!input) return [];
    return locations.filter((location) =>
      location.name.toLowerCase().includes(input.toLowerCase()) ||
      location.postalCode.includes(input)
    );
  };

  // Debounced filtering to improve performance
  useEffect(() => {
    if (focusedInput === 'start') {
      setSuggestions(filterSuggestions(startLocation));
    } else if (focusedInput === 'destination') {
      setSuggestions(filterSuggestions(destination));
    }
  }, [startLocation, destination, focusedInput]);

  const handleInputChange = (e, inputType) => {
    const value = e.target.value;
    if (inputType === 'start') {
      setStartLocation(value);
    } else {
      setDestination(value);
    }
    setFocusedInput(inputType);
  };

  const handleSelectSuggestion = (suggestion, inputType) => {
    if (inputType === 'start') {
      setStartLocation(suggestion.name);
    } else {
      setDestination(suggestion.name);
    }
    setSuggestions([]);
    setFocusedInput(null);
  };

  const handleMapSelection = (selectedLocation) => {
    if (focusedInput === 'start') {
      setStartLocation(selectedLocation.name);
    } else if (focusedInput === 'destination') {
      setDestination(selectedLocation.name);
    }
    setSuggestions([]);
    setFocusedInput(null);
  };

  const handleSearch = () => {
    const isStartValid = locations.some(loc => loc.name.toLowerCase() === startLocation.toLowerCase());
    const isDestinationValid = locations.some(loc => loc.name.toLowerCase() === destination.toLowerCase());

    if (!startLocation || !destination) {
      setAlert({ show: true, message: 'Please enter both starting location and destination.', type: 'error' });
      return;
    }

    if (!isStartValid) {
      setAlert({ show: true, message: 'The starting location is not in the database.', type: 'error' });
      return;
    }

    if (!isDestinationValid) {
      setAlert({ show: true, message: 'The destination is not in the database.', type: 'error' });
      return;
    }

    setAlert({ show: true, message: 'Search initiated successfully!', type: 'success' });

    // Hide alert after 3 seconds automatically
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);

    navigate('/comparison');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Alert */}
      {alert.show && (
        <div className="w-full max-w-lg mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
        </div>
      )}

      {/* Header */}
      <header className="bg-white w-full py-4 shadow-md flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">SmartCommute</h1>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center mt-6 w-full max-w-lg">
        <div className="border border-gray-300 bg-gray-100 p-4 rounded-md mb-4">
          <p className="text-gray-600">
            Location can be entered as text or double click the map.
          </p>
        </div>

        {/* Starting Location Input */}
        <div className="w-full mb-4 relative">
          <label htmlFor="startLocation" className="block text-gray-700 text-lg font-medium mb-2">
            Starting Location
          </label>
          <input
            type="text"
            id="startLocation"
            placeholder="Enter starting location"
            value={startLocation}
            onChange={(e) => handleInputChange(e, 'start')}
            onFocus={() => setFocusedInput('start')}
            onBlur={() => setTimeout(() => setFocusedInput(null), 200)} // Hide suggestions on blur
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 shadow-sm"
          />

          {focusedInput === 'start' && startLocation === '' && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg z-10">
              <li
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelectSuggestion(favoriteLocation, 'start')}
              >
                ⭐ {favoriteLocation.name} (Favorite)
              </li>
              {frequentlyUsedLocations.map((location) => (
                <li
                  key={location.name}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectSuggestion(location, 'start')}
                >
                  {location.name} (Frequently Used)
                </li>
              ))}
            </ul>
          )}

          {suggestions.length > 0 && focusedInput === 'start' && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.name}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectSuggestion(suggestion, 'start')}
                >
                  {suggestion.name} ({suggestion.postalCode})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination Input */}
        <div className="w-full mb-4 relative">
          <label htmlFor="destination" className="block text-gray-700 text-lg font-medium mb-2">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => handleInputChange(e, 'destination')}
            onFocus={() => setFocusedInput('destination')}
            onBlur={() => setTimeout(() => setFocusedInput(null), 200)} // Hide suggestions on blur
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 shadow-sm"
          />

          {focusedInput === 'destination' && destination === '' && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg z-10">
              <li
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelectSuggestion(favoriteLocation, 'destination')}
              >
                ⭐ {favoriteLocation.name} (Favorite)
              </li>
              {frequentlyUsedLocations.map((location) => (
                <li
                  key={location.name}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectSuggestion(location, 'destination')}
                >
                  {location.name} (Frequently Used)
                </li>
              ))}
            </ul>
          )}

          {suggestions.length > 0 && focusedInput === 'destination' && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.name}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectSuggestion(suggestion, 'destination')}
                >
                  {suggestion.name} ({suggestion.postalCode})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Search
        </button>
      </main>

      {/* Map with clickable points */}
      <div className="mt-10 w-full max-w-2xl h-96 bg-gray-200 rounded-lg shadow-md flex items-center justify-center relative">
        <MapComponent
          onSelectLocation={handleMapSelection}
          isSelectingStart={focusedInput === 'start'}
        />
      </div>
    </div>
  );
};

export default SearchPage;