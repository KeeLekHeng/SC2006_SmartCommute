import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { useJsApiLoader } from '@react-google-maps/api';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import settings from '../assets/setttings.png';
import favourites from '../assets/fav.png';
import home from '../assets/home.png';
import Logo from '../assets/logo1.png';

const FavoritesPage = () => {
  const { user } = useContext(UserContext);
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
    if (user) {
      fetchFavorites();
    }
    window.scrollTo(0, 0);
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
        username: user,
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
    <div className={styles.container}>
      
      {/* Header */}
      <nav className={styles.header}>
        <div className={styles.headerContent}>
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className={styles.logo} />
            <span className="text-2xl font-bold">SmartCommute</span>
          </div>

          <div className="flex space-x-44">
            <div className={styles.navItem}>
              <img src={home} alt="Home" className="w-14 h-14" />
              <Link to="/main" className={styles.navLink}>
                Home
              </Link>
            </div>
            <div className={styles.navItem}>
              <img src={favourites} alt="Favourites" className="w-12 h-12 mb-2" />
              <Link to="/favourites" className={styles.navLink}>
                Favourites
              </Link>
            </div>
            <div className={styles.navItem}>
              <img src={settings} alt="Settings" className="w-14 h-14" />
              <Link to="/settings" className={styles.navLink}>
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <header className="mb-6 text-center">
          <h2 className={styles.pageTitle}>Favorites</h2>
        </header>

        {/* Display Existing Favorites */}
        {favorites.length > 0 ? (
          <div className="w-full space-y-4">
            {favorites.map((location) => (
              <div
                key={location._id}
                className={styles.favoriteItem}
              >
                <div>
                  <h3 className="text-lg font-semibold">{location.name}</h3>
                  <p className="text-sm">{location.location}</p>
                </div>
                <button
                  onClick={() => handleDeleteFavorite(location._id)}
                  className={styles.deleteButton}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No saved locations.</p>
        )}

        {/* Search and Add Favorite Section */}
        <input
          type="text"
          placeholder="Search for a location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
        <button
          className={styles.searchButton}
          onClick={handleSearch}
        >
          Search
        </button>

        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className={styles.searchResultItem}
                onClick={() => handleSelectLocation(result)}
              >
                <p className="font-medium">{result.name}</p>
                <p className="text-sm text-gray-500">{result.formatted_address}</p>
              </div>
            ))}
          </div>
        )}

        {selectedLocation && (
          <div className="w-full mt-4">
            <input
              type="text"
              placeholder="Name this location (e.g., Home, Work)"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleAddFavorite} className={styles.saveButton}>
              Save as Favorite
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <Link to="/review" className={styles.footerLink}>
          <i className="material-icons text-yellow-500 mr-4">star</i>
          Leave us a review 
          <i className="material-icons text-yellow-500 ml-4">star</i>
        </Link>
        <span className="block mt-2 text-white"> www.smartcommutesg.com</span>
      </footer>
    </div>
  );
};

const styles = {
  container: "flex flex-col h-screen bg-[#E8F0FA]",
  header: "fixed h-24 top-0 left-0 right-0 bg-[#4169E1] text-white shadow-md z-40 transition-all duration-300",
  headerContent: "flex items-center justify-between h-full px-4",
  logo: "w-18 h-14 mr-6",
  navItem: "flex flex-col items-center",
  navLink: "hover:underline text-lg font-semibold transition duration-300 pb-2 text-white",
  mainContent: "pt-28 flex-1 overflow-y-auto px-4 pb-8",
  pageTitle: "text-teal-700 text-3xl font-bold",
  favoriteItem: "bg-blue-500 text-white py-4 px-6 rounded-lg shadow-lg flex justify-between items-center",
  deleteButton: "text-red-200 hover:text-red-500 font-bold text-lg",
  input: "w-full mb-4 p-3 border border-gray-300 rounded-lg shadow-sm",
  searchButton: "w-full bg-[#4169E1] text-white py-3 px-4 rounded-full font-semibold hover:bg-[#3a5eb4] transition shadow-lg",
  searchResults: "w-full mb-4 space-y-2",
  searchResultItem: "bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition",
  saveButton: "w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition shadow-md",
  footer: "bg-[#4169E1] text-center text-lg text-white py-2 fixed bottom-0 w-full z-30",
  footerLink: "hover:underline mb-1 text-white",
};

export default FavoritesPage;
