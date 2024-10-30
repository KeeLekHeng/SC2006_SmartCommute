// Comparisons.jsx
import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, DirectionsService, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const Comparisons = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [sortOption, setSortOption] = useState("time");
  const [routes, setRoutes] = useState([]);
  const [isServiceLoaded, setIsServiceLoaded] = useState(false); // Track if service has been loaded

  const startingLocation = "Nanyang Technological University";
  const destination = "Jurong Point MRT Station";

  // Load Google Maps API once with specific options
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Callback to handle response from DirectionsService
  const directionsCallback = useCallback((response) => {
    if (response && response.status === "OK") {
      setDirectionsResponse(response);

      // Process and set routes based on the response
      const processedRoutes = response.routes.map((route) => {
        const leg = route.legs[0];
        return {
          duration: leg.duration.value, // In seconds, for sorting
          durationText: leg.duration.text,
          price: (Math.random() * 5 + 2).toFixed(2), // Mock price
          steps: leg.steps.map((step) => step.travel_mode),
          routeDetails: route,
        };
      });
      setRoutes(processedRoutes);
    }
  }, []);

  // Sort routes based on user choice
  const sortedRoutes = [...routes].sort((a, b) => {
    if (sortOption === "time") {
      return a.duration - b.duration;
    } else {
      return parseFloat(a.price) - parseFloat(b.price);
    }
  });

  // Load DirectionsService only once after API is loaded
  useEffect(() => {
    if (isLoaded && !isServiceLoaded) {
      setIsServiceLoaded(true);
    }
  }, [isLoaded, isServiceLoaded]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">Route Comparisons</h1>

      {/* Sorting Options */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${sortOption === "price" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setSortOption("price")}
        >
          Price
        </button>
        <button
          className={`px-4 py-2 rounded ${sortOption === "time" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setSortOption("time")}
        >
          Time
        </button>
      </div>

      {/* Routes List */}
      <div className="w-full max-w-lg space-y-4">
        {sortedRoutes.map((route, index) => (
          <div
            key={index}
            onClick={() =>
              window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startingLocation)}&destination=${encodeURIComponent(destination)}&travelmode=transit`)
            }
            className="flex items-center justify-between p-4 border rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
          >
            {/* Left Part: Icons */}
            <div className="flex items-center space-x-2">
              {route.steps.map((step, i) => (
                <div key={i} className="p-1 rounded-full bg-green-500 text-white">
                  {step === "TRANSIT" ? "🚍" : "🚇"}
                </div>
              ))}
            </div>
            {/* Right Part: Price and Time */}
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold">${route.price}</span>
              <span className="text-sm text-gray-600">{route.durationText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Conditionally render DirectionsService to avoid reloading */}
      {isServiceLoaded && (
        <GoogleMap
          center={{ lat: 1.3483, lng: 103.6831 }}
          zoom={14}
          mapContainerStyle={{ width: "100%", height: "0px" }}
        >
          <DirectionsService
            options={{
              origin: startingLocation,
              destination: destination,
              travelMode: "TRANSIT",
            }}
            callback={directionsCallback}
          />
        </GoogleMap>
      )}
    </div>
  );
};

export default Comparisons;