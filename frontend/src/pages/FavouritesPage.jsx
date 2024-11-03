import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useJsApiLoader } from '@react-google-maps/api';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const { user } = useContext(UserContext);  // Retrieve user instead of setUsername
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const loaderOptions = useMemo(() => ({
    googleMapsApiKey: process.env.REACT_APP_GMAPSAPI,
    id: 'google-map-script',
    libraries: ['places'],
  }), []);

  const { isLoaded } = useJsApiLoader(loaderOptions);

  useEffect(() => {
    if (user) {  // Ensure user is defined before fetching favorites
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/favorites/${user}`);
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setAlertMessage("Failed to load favorites.");
      setAlertType("error");
    }
  };

  const handleSearch = () => {
    if (!searchTerm || !isLoaded || !window.google) return;

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      query: searchTerm,
      fields: ['name', 'formatted_address', 'geometry'],
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSearchResults(results);
      } else {
        console.error('Error with Places Service:', status);
      }
    });
  };

  const handleSelectLocation = (result) => {
    setSelectedLocation(result); 
    setSearchTerm(result.name); 
    setSearchResults([]); 
  };

  const handleAddFavorite = async (event) => {
    event.preventDefault();
    if (!locationName || !selectedLocation) {
      setAlertMessage("Please select a location and provide a name.");
      setAlertType("error");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/favorites', {
        username: user,  // Using user here to represent the username
        name: locationName,
        location: selectedLocation.formatted_address,
      });
      setAlertMessage(`${locationName} has been added to your favorites!`);
      setAlertType("success");
  
      setLocationName('');
      setSearchTerm('');
      setSelectedLocation(null);
      setSearchResults([]);
  
      fetchFavorites();
    } catch (error) {
      console.error("Error adding favorite:", error);
      setAlertMessage("Failed to add favorite. Please try again.");
      setAlertType("error");
    }
  };

  const handleDeleteFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/favorites/${id}`);
      setFavorites(favorites.filter(fav => fav._id !== id));
      setAlertMessage("Favorite removed successfully.");
      setAlertType("success");
    } catch (error) {
      console.error("Error deleting favorite:", error);
      setAlertMessage("Failed to delete favorite.");
      setAlertType("error");

      setTimeout(() => {
        setAlertMessage('');
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-cyan-100 overflow-hidden p-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 flex flex-col items-center">
        <header className="mb-6 text-center">
          <h2 className="text-teal-700 text-3xl font-bold">Favorites</h2>
        </header>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/main')} 
          className="self-start mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 hover:shadow-md transition flex items-center"
        >
          <span className="mr-2">←</span> Back to Main Page
        </button>

        {/* Display Alert Message */}
        {alertMessage && (
          <div className={`w-full mb-4 p-3 text-center ${alertType === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}>
            {alertMessage}
          </div>
        )}

        {/* Display Existing Favorites */}
        {favorites.length > 0 ? (
          <div className="w-full space-y-4">
            {favorites.map((location) => (
              <div
                key={location._id}
                className="bg-blue-500 text-white py-4 px-6 rounded-lg shadow-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{location.name}</h3>
                  <p className="text-sm">{location.location}</p>
                </div>
                <button
                  onClick={() => handleDeleteFavorite(location._id)}
                  className="text-red-200 hover:text-red-500 font-bold text-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No saved locations.</p>
        )}

        {/* Search for a New Location */}
        <input
          type="text"
          placeholder="Search for a location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg shadow-sm"
        />
        <button
          className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-600 transition shadow-md"
          onClick={handleSearch}
        >
          Search
        </button>

        {/* Display Search Results */}
        {searchResults.length > 0 && (
          <div className="w-full mb-4 space-y-2">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                onClick={() => handleSelectLocation(result)}
              >
                <p className="font-medium">{result.name}</p>
                <p className="text-sm text-gray-500">{result.formatted_address}</p>
              </div>
            ))}
          </div>
        )}

        {/* Input for Naming Selected Location */}
        {selectedLocation && (
          <div className="w-full mt-4">
            <input
              type="text"
              placeholder="Name this location (e.g., Home, Work)"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg shadow-sm"
            />
            <button onClick={handleAddFavorite} className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition shadow-md">
              Save as Favorite
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

