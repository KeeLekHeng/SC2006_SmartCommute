import React, { useState, useRef, useEffect, useContext } from 'react';
import Alert from '../components/Alert';
import { UserContext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox, Marker} from "@react-google-maps/api";
import axios from 'axios'; 
import moment from 'moment-timezone';

const API_KEY = process.env.REACT_APP_GMAPSAPI;
const libraries = ['places'];

const SearchPage = () => {
  const {user: username} = useContext(UserContext);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [userLocation, setUserLocation] = useState(null);
  

  const [line, setLine] = useState(null);
  const [destinationMarkerPosition, setDestinationMarkerPosition] = useState(null);
  const [startLocationMarkerPosition, setStartLocationMarkerPosition] = useState(null);

  const startRef = useRef(null);
  const destinationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });

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
  }, []);

  const drawLineBetweenMarkers = (start, destination) => {
    // Clear any existing line before drawing a new one
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
    if (!startLocation || !destination) {
      window.alert("Both Start Location and Destination fields must be filled!"); 
      return; 
    }

    console.log("Start location:", startLocation);
    console.log("Destination:", destination);

    const sgTime = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
    try { 
      const response = await axios.post('http://localhost:4000/search/', {
        username, start_location: startLocation, destination: destination, timestamp: sgTime, 
      }); 
      if (response.status === 201) { 
        setAlert({ show: true, message: "Search saved to the database successfully!", type: "success" });
      }
      navigate('/comparisons'); 
    } catch (error) { 
      const errorMessage = error.response && error.response.data.error ? error.response.data.error : "Failed to save to database!";
      setAlert({ show: true, message: errorMessage, type: "error" }); 
    }
  }

  const handleStartLocationClear = () => {
    setStartLocation('');
    setStartLocationMarkerPosition(null);
    setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.title !== 'Starting Location'));

    // Remove the line if it exists
    if (line) {
        line.setMap(null);
        setLine(null);
    }
};

const handleDestinationClear = () => {
    setDestination('');
    setDestinationMarkerPosition(null);
    setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.title !== 'Destination'));

    if (line) {
        line.setMap(null);
        setLine(null);
    }
};

  const handleOnPlacesChanged = (inputType, ref) => {
    const places = ref.getPlaces();
    if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
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
                    map.setZoom(15);  // Zoom in on starting location
                    map.panTo(newMarker.position);  // Center map on starting location
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
    } else {
        setAlert({ show: true, message: 'Invalid location selected.', type: 'error' });
    }
  };

  const handleUseCurrentLocation = async () => {
    if (userLocation) {
      try {
        // Reverse geocode the coordinates to get the actual address
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${API_KEY}`);
        
        console.log('Reverse Geocode Response:', response.data); // Log the response to inspect

        if (response.data && response.data.results.length > 0) {
          const address = response.data.results[0].formatted_address;
          setStartLocation(address); // Update the input field with the fetched address
        } else {
          setStartLocation('Unable to determine address');
        }
  
        // Ensure the marker is set for the current location
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
  
  

  return (
    <div className="flex w-full h-[calc(100vh-8rem)] overflow-hidden pt-4">       
      {alert.show && (
        <div className="absolute top-0 left-0 right-0 p-4 z-40">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
        </div>
      )}

      <div className="w-3/5 h-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '600px' }}
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

      <div className="w-2/5 h-full flex items-center justify-center p-4">
        <div className="w-3/4 max-w-md max-h-full overflow-hidden flex flex-col justify-center">
          <div className="border border-gray-300 bg-gray-100 p-4 rounded-md mb-4 text-center">
            <p className="text-gray-600">Enter your starting and ending location</p>
          </div>

          <button onClick={handleUseCurrentLocation} className="mb-4 bg-green-300 p-2 rounded-md">
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
                  onChange={(e) => setStartLocation(e.target.value)}
                />
              </StandaloneSearchBox>
            )}
            <button 
              onClick={handleStartLocationClear} 
              className="absolute right-3 top-1/2 transform bg-gray-300 text-sm text-gray-700 p-1 rounded-full hover:bg-gray-400"
            >
              Clear
            </button>
          </div>

          <div className="w-full mb-4 relative">
            <label htmlFor="destination" className="block text-gray-700 text-lg font-medium mb-2">
              Destination
            </label>
            {isLoaded && (
              <StandaloneSearchBox
                onLoad={(ref) => (destinationRef.current = ref)}
                onPlacesChanged={() => handleOnPlacesChanged('destination', destinationRef.current)}
                options={{ componentRestrictions: { country: 'SG' }, strictBounds: true }}
              >
                <input
                  type="text"
                  placeholder="Enter destination"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </StandaloneSearchBox>
            )}
            <button 
              onClick={handleDestinationClear} 
              className="absolute right-3 top-1/2 transform bg-gray-300 text-sm text-gray-700 p-1 rounded-full hover:bg-gray-400"
            >
              Clear
            </button>
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