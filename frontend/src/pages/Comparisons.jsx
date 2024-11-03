import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const RouteOption = ({ route, startLocation, destination, onHover }) => (
  <div
    onMouseEnter={() => onHover(route.index)}
    onClick={() =>
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destination)}&travelmode=transit`)
    }
    className="flex items-center justify-between p-4 border rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
  >
    <div className="flex items-center space-x-2">
      {route.steps.map((step, i) => (
        <div key={i} className="p-1 rounded-full bg-green-500 text-white text-xs">
          {step.travelMode === "TRANSIT" ? (
            step.isMRT ? `🚇 ${step.transitLine}` : `🚍 ${step.transitLine || '199'}`
          ) : (
            step.travelMode === "WALKING" ? "🚶‍♂️" : ""
          )}
        </div>
      ))}
    </div>
    <div className="flex flex-col items-end">
      <span className="text-lg font-semibold">${route.price}</span>
      <span className="text-sm text-gray-600">{route.durationText}</span>
    </div>
  </div>
);

const ComparisonPage = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [sortOption, setSortOption] = useState("time");
  const [routes, setRoutes] = useState([]);
  const [hoveredRouteIndex, setHoveredRouteIndex] = useState(null);
  const [directionsFetched, setDirectionsFetched] = useState(false);

  const location = useLocation();
  const { startLocation, destination } = location.state || {};

  const directionsCallback = useCallback((response) => {
    if (response && response.status === "OK" && !directionsFetched) {
      const processedRoutes = response.routes.slice(0, 6).map((route, index) => {
        const leg = route.legs[0];
        return {
          index,
          duration: leg.duration.value,
          durationText: leg.duration.text,
          price: (Math.random() * 5 + 2).toFixed(2),
          steps: leg.steps.map((step) => {
            const isTransit = step.travel_mode === "TRANSIT";
            return {
              travelMode: step.travel_mode,
              transitLine: isTransit && step.transit_details ? step.transit_details.line.short_name || "199" : "No line info",
              instructions: step.html_instructions,
              duration: step.duration.text,
              isMRT: isTransit && step.transit_details && step.transit_details.line.vehicle.type === "SUBWAY",  // check if MRT
            };
          }),
        };
      });
      setRoutes(processedRoutes);
      setDirectionsResponse(response);
      setDirectionsFetched(true);
    }
  }, [directionsFetched]);

  useEffect(() => {
    setDirectionsFetched(false);
  }, [startLocation, destination]);

  const sortedRoutes = [...routes].sort((a, b) => {
    return sortOption === "time" ? a.duration - b.duration : parseFloat(a.price) - parseFloat(b.price);
  });

  return (
    <div className="p-4 flex flex-col md:flex-row items-start">
      <div className="w-full md:w-1/2 flex flex-col items-center">
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
            <RouteOption
              key={index}
              route={route}
              startLocation={startLocation}
              destination={destination}
              onHover={(routeIndex) => setHoveredRouteIndex(routeIndex)}
            />
          ))}
        </div>
      </div>

      {startLocation && destination && (
        <div className="w-full md:w-1/2">
          <GoogleMap
            center={{ lat: 1.3483, lng: 103.6831 }}
            zoom={14}
            mapContainerStyle={{ width: "100%", height: "400px" }}
          >
            <DirectionsService
              options={{
                origin: startLocation,
                destination: destination,
                travelMode: "TRANSIT",
                provideRouteAlternatives: true,
              }}
              callback={directionsCallback}
            />
            {hoveredRouteIndex !== null && directionsResponse && (
              <DirectionsRenderer directions={{ ...directionsResponse, routes: [directionsResponse.routes[hoveredRouteIndex]] }} />
            )}
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
