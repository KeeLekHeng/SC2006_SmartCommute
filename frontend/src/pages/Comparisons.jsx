import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { GoogleMap, DirectionsService, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const ComparisonPage = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [sortOption, setSortOption] = useState("time");
  const [routes, setRoutes] = useState([]);
  const [isServiceLoaded, setIsServiceLoaded] = useState(false);

  const location = useLocation();
  const { startLocation, destination } = location.state || {};

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPSAPI,
    libraries: ["places"],
  });

  const directionsCallback = useCallback((response) => {
    if (response && response.status === "OK") {
      setDirectionsResponse(response);
      const processedRoutes = response.routes.map((route) => {
        const leg = route.legs[0];
        return {
          duration: leg.duration.value,
          durationText: leg.duration.text,
          price: (Math.random() * 5 + 2).toFixed(2),
          steps: leg.steps.map((step) => step.travel_mode),
          routeDetails: route,
        };
      });
      setRoutes(processedRoutes);
    }
  }, []);

  // Sort routes based on user choice
  const sortedRoutes = [...routes].sort((a, b) => {
    return sortOption === "time" ? a.duration - b.duration : parseFloat(a.price) - parseFloat(b.price);
  });

  // Load DirectionsService when API is loaded
  useEffect(() => {
    if (isLoaded && startLocation && destination) {
      setIsServiceLoaded(true);
    }
  }, [isLoaded, startLocation, destination]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">Route Comparisons</h1>

      <div className="flex space-x-4 mb-4">
        <button className={`px-4 py-2 rounded ${sortOption === "price" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setSortOption("price")}>
          Price
        </button>
        <button className={`px-4 py-2 rounded ${sortOption === "time" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setSortOption("time")}>
          Time
        </button>
      </div>

      <div className="w-full max-w-lg space-y-4">
        {sortedRoutes.map((route, index) => (
          <div
            key={index}
            onClick={() =>
              window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destination)}&travelmode=transit`)
            }
            className="flex items-center justify-between p-4 border rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              {route.steps.map((step, i) => (
                <div key={i} className="p-1 rounded-full bg-green-500 text-white">
                  {step === "TRANSIT" ? "🚍" : "🚇"}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold">${route.price}</span>
              <span className="text-sm text-gray-600">{route.durationText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Only render DirectionsService when locations are set */}
      {isServiceLoaded && startLocation && destination && (
        <GoogleMap
          key={`${startLocation}-${destination}`} // Use unique key to force remount
          center={{ lat: 1.3483, lng: 103.6831 }} // Default center, adjust as needed
          zoom={14}
          mapContainerStyle={{ width: "100%", height: "400px" }} // Set fixed height
        >
          <DirectionsService
            options={{
              origin: startLocation,
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

export default ComparisonPage;