import React, { useState, useRef, useEffect, useContext } from 'react';
import Alert from '../components/Alert';
import { UserContext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox, Marker } from "@react-google-maps/api";
import axios from 'axios'; 
import moment from 'moment-timezone';

const API_KEY = process.env.REACT_APP_GMAPSAPI;
const libraries = ['places'];

const SearchPage = () => {
  const { user: username } = useContext(UserContext);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesDropdown, setShowFavoritesDropdown] = useState({ start: false, destination: false });
  const [errors, setErrors] = useState({ startLocation: '', destination: '' });

  const [line, setLine] = useState(null); 
  const [startLocationMarkerPosition, setStartLocationMarkerPosition] = useState(null);
  const [destinationMarkerPosition, setDestinationMarkerPosition] = useState(null);

  const startRef = useRef(null);
  const destinationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/favorites/${username}`);
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setAlert({ show: true, message: "Failed to load favorites.", type: "error" });
    }
  };

  useEffect(() => {
    if (username) {
      fetchFavorites();
    }
  }, [username]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLatLng);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  const drawLineBetweenMarkers = (start, destination) => {
    if (line) {
      line.setMap(null);
      setLine(null);
    }

    const path = [
      new window.google.maps.LatLng(start.lat, start.lng),
      new window.google.maps.LatLng(destination.lat, destination.lng),
    ];

    const newLine = new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    newLine.setMap(map);
    setLine(newLine);

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(new window.google.maps.LatLng(start.lat, start.lng));
    bounds.extend(new window.google.maps.LatLng(destination.lat, destination.lng));
    map.fitBounds(bounds);
  };

  const handleSearch = async () => { 
    let validationErrors = {};
    if (!startLocation) {
      validationErrors.startLocation = 'Please fill in the starting location';
    }
    if (!destination) {
      validationErrors.destination = 'Please fill in the destination';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // Clear previous errors if input is valid

    const sgTime = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
    try { 
      const response = await axios.post('http://localhost:4000/search/', {
        username, start_location: startLocation, destination: destination, timestamp: sgTime, 
      }); 
      if (response.status === 201) { 
        setAlert({ show: true, message: "Search saved to the database successfully!", type: "success" });
      }
      navigate('/comparisons', { state: { startLocation, destination } });  
    } catch (error) { 
      const errorMessage = error.response && error.response.data.error ? error.response.data.error : "Failed to save to database!";
      setAlert({ show: true, message: errorMessage, type: "error" }); 
    }
  };

  const handleClear = (field) => {
    if (field === 'start') {
      setStartLocation('');
      setStartLocationMarkerPosition(null);
      setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.title !== 'Starting Location'));
    } else if (field === 'destination') {
      setDestination('');
      setDestinationMarkerPosition(null);
      setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.title !== 'Destination'));
    }

    if (line) {
      line.setMap(null);
      setLine(null);
    }
  };

  const isSingapore = (address) => { 
    if (!address) return false; 
    const formattedAddress = address.trim().toLowerCase(); 
    // Check if "singapore" appears anywhere in the address 
    return formattedAddress.includes("singapore"); 
  };

  const handleOnPlacesChanged = (inputType, ref) => {
    const places = ref.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      if (place.geometry && place.geometry.location) {
        const newErrors = { ...errors }; // Copy current errors to modify them 
 
        // Check if the selected location is not in Singapore and set the appropriate error 
        if (!isSingapore(place.formatted_address)) { 
          if (inputType === 'start') { 
            newErrors.startLocation = "Pick a valid starting location in Singapore."; 
          } else if (inputType === 'destination') { 
            newErrors.destination = "Pick a valid destination in Singapore."; 
          } 
          setErrors(newErrors);  
          return;  
        } 
   
        // Clear any existing error for the current input type if the location is valid 
        if (inputType === 'start') { 
          delete newErrors.startLocation; 
        } else if (inputType === 'destination') { 
          delete newErrors.destination; 
        } 
        setErrors(newErrors);
        const location = place.geometry.location;

        const newMarker = {
          position: { lat: location.lat(), lng: location.lng() },
          title: inputType === 'start' ? 'Starting Location' : 'Destination',
        };

        if (inputType === 'start') {
          setStartLocation(place.formatted_address);
          setStartLocationMarkerPosition(newMarker.position);

          setMarkers((prevMarkers) => prevMarkers
            .filter(marker => marker.title !== 'Starting Location')
            .concat(newMarker));
          
          if (map) {
            map.setZoom(15);
            map.panTo(newMarker.position);
          }

          if (line) line.setMap(null);
        } else {
          setDestination(place.formatted_address);
          setDestinationMarkerPosition(newMarker.position);

          setMarkers((prevMarkers) => prevMarkers
            .filter(marker => marker.title !== 'Destination')
            .concat(newMarker));
        }

        if (map) {
          if (inputType === 'start' && destinationMarkerPosition) {
            drawLineBetweenMarkers(newMarker.position, destinationMarkerPosition);
          } else if (inputType === 'destination' && startLocationMarkerPosition) {
            drawLineBetweenMarkers(startLocationMarkerPosition, newMarker.position);
          }
        }
      }
    }
  };

  const handleUseCurrentLocation = async () => {
    if (userLocation) {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${API_KEY}`);
        
        if (response.data && response.data.results.length > 0) {
          const address = response.data.results[0].formatted_address;
          setStartLocation(address);
        } else {
          setStartLocation('Unable to determine address');
        }

        setStartLocationMarkerPosition(userLocation);
        setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.title !== 'Starting Location')
          .concat({ position: userLocation, title: 'Starting Location' }));

        if (destinationMarkerPosition) {
          drawLineBetweenMarkers(userLocation, destinationMarkerPosition);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        setStartLocation('Unable to fetch address');
      }
    }
  };

  const handleFavoriteSelect = (favorite, inputType) => {
    if (inputType === 'start') {
      setStartLocation(favorite.location); 
    } else {
      setDestination(favorite.location);
    }
    setShowFavoritesDropdown((prev) => ({ ...prev, [inputType]: false }));
    
    if (favorite.lat && favorite.lng) {
      const position = { lat: favorite.lat, lng: favorite.lng };
      setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.title !== (inputType === 'start' ? 'Starting Location' : 'Destination'))
        .concat({ position, title: inputType === 'start' ? 'Starting Location' : 'Destination' }));
      if (map) {
        map.panTo(position);
      }
    }
  };

  const handleFocus = (inputType) => {
    if (inputType === 'start' && startLocation === '') {
      setShowFavoritesDropdown((prev) => ({ ...prev, start: true }));
    } else if (inputType === 'destination' && destination === '') {
      setShowFavoritesDropdown((prev) => ({ ...prev, destination: true }));
    }
  };

  const handleChange = (e, inputType) => {
    if (inputType === 'start') {
      setStartLocation(e.target.value);
      setShowFavoritesDropdown((prev) => ({ ...prev, start: e.target.value === '' }));
    } else if (inputType === 'destination') {
      setDestination(e.target.value);
      setShowFavoritesDropdown((prev) => ({ ...prev, destination: e.target.value === '' }));
    }
  };

  const handleBlur = (inputType) => {
    setTimeout(() => setShowFavoritesDropdown((prev) => ({ ...prev, [inputType]: false })), 100);
  };

  return (
    <div className="flex w-full h-[calc(100vh-8rem)] overflow-hidden pt-4">
      {alert.show && (
        <div className="absolute top-0 left-0 right-0 p-4 z-40">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
        </div>
      )}
  
      <div className="w-3/4 h-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: 'calc(100vh - 8rem)' }}
            zoom={12}
            center={center}
            onLoad={(mapInstance) => setMap(mapInstance)}
          >
            {markers.map((marker, index) => (
              <Marker key={index} position={marker.position} title={marker.title} />
            ))}
          </GoogleMap>
        ) : (
          <div>Loading....</div>
        )}
      </div>
  
      <div className="w-1/4 h-full flex items-center justify-center p-4">
        <div className="w-3/4 max-w-md max-h-full overflow-visible flex flex-col justify-start relative">
          <button onClick={handleUseCurrentLocation} className="mb-4 bg-green-300 p-2 rounded-md font-semibold hover:bg-[#4CAF50] transition shadow-lg">
            Use Current Location
          </button>
  
          <div className="w-full mb-4 relative">
            <label htmlFor="startLocation" className="block text-gray-700 text-lg font-medium mb-2">
              Starting Location
            </label>
            {isLoaded && (
              <StandaloneSearchBox
                onLoad={(ref) => (startRef.current = ref)}
                onPlacesChanged={() => handleOnPlacesChanged('start', startRef.current)}
                options={{ componentRestrictions: { country: 'SG' }, strictBounds: true }}
              >
                <input
                  type="text"
                  placeholder="Enter starting location"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  value={startLocation}
                  onChange={(e) => handleChange(e, 'start')}
                  onFocus={() => handleFocus('start')}
                  onBlur={() => handleBlur('start')}
                />
              </StandaloneSearchBox>
            )}
             {errors.startLocation && <p className="text-red-500 text-sm mt-1">{errors.startLocation}</p>}
            <button 
              onClick={() => handleClear('start')} 
              className="absolute right-3 top-1/2 transform bg-gray-300 text-sm text-gray-700 p-1 rounded-full hover:bg-gray-400"
            >
              Clear
            </button>
            {showFavoritesDropdown.start && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50">
                {favorites.length > 0 ? (
                  favorites.map((favorite, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleFavoriteSelect(favorite, 'start')}
                    >
                      {favorite.name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 p-2">No favorite locations available</p>
                )}
              </div>
            )}
          </div>
  
          <div className="w-full mb-4 relative">
            <label htmlFor="destination" className="block text-gray-700 text-lg font-medium mb-2">
              Destination
            </label>
            {isLoaded && (
              <StandaloneSearchBox
                onLoad={(ref) => (destinationRef.current = ref)}
                onPlacesChanged={() => handleOnPlacesChanged('destination', destinationRef.current)}
                options={{ 
                  bounds: { north: 1.4784, south: 1.1484, east: 104.0945, west: 103.594, }, 
                  componentRestrictions: { country: 'SG' }, strictBounds: true }}
              >
                <input
                  type="text"
                  placeholder="Enter destination"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  value={destination}
                  onChange={(e) => handleChange(e, 'destination')}
                  onFocus={() => handleFocus('destination')}
                  onBlur={() => handleBlur('destination')}
                />
              </StandaloneSearchBox>
            )}
              {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
            <button 
              onClick={() => handleClear('destination')} 
              className="absolute right-3 top-1/2 transform bg-gray-300 text-sm text-gray-700 p-1 rounded-full hover:bg-gray-400"
            >
              Clear
            </button>
            {showFavoritesDropdown.destination && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50">
                {favorites.length > 0 ? (
                  favorites.map((favorite, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleFavoriteSelect(favorite, 'destination')}
                    >
                      {favorite.name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 p-2">No favorite locations available</p>
                )}
              </div>
            )}
          </div>
  
          <button onClick={handleSearch} className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition duration-200">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
