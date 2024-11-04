import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

// Fare tables (same as original code)
const mrtLrtFareTable = [
  { minDistance: 3.2, maxDistance: 6.91, fare: 0.62 },
  { minDistance: 6.91, maxDistance: 10.62, fare: 0.81 },
  { minDistance: 10.62, maxDistance: 14.33, fare: 1.00 },
  { minDistance: 14.33, maxDistance: 18.04, fare: 1.20 },
  { minDistance: 18.04, maxDistance: 21.75, fare: 1.40 },
  { minDistance: 21.75, maxDistance: 25.46, fare: 1.59 },
  { minDistance: 25.46, maxDistance: 29.17, fare: 1.78 },
  { minDistance: 29.17, maxDistance: 32.88, fare: 1.98 },
  { minDistance: 32.88, maxDistance: 36.59, fare: 2.18 },
  { minDistance: 36.59, maxDistance: 40.3, fare: 2.37 },
  { minDistance: 40.3, fare: 2.37 }
];

const busFareTable = [
  { maxDistance: 3.2, fare: 1.69 },
  { minDistance: 3.3, maxDistance: 4.2, fare: 1.79 },
  { minDistance: 4.3, maxDistance: 5.2, fare: 1.90 },
  { minDistance: 5.3, maxDistance: 6.2, fare: 2.00 },
  { minDistance: 6.3, maxDistance: 7.2, fare: 2.09 },
  { minDistance: 7.3, maxDistance: 8.2, fare: 2.16 },
  { minDistance: 8.3, maxDistance: 9.2, fare: 2.23 },
  { minDistance: 9.3, maxDistance: 10.2, fare: 2.27 },
  { minDistance: 10.3, maxDistance: 11.2, fare: 2.31 },
  { minDistance: 11.3, maxDistance: 12.2, fare: 2.35 },
  { minDistance: 12.3, maxDistance: 13.2, fare: 2.39 },
  { minDistance: 13.3, maxDistance: 14.2, fare: 2.43 },
  { minDistance: 14.3, maxDistance: 15.2, fare: 2.48 },
  { minDistance: 15.3, maxDistance: 16.2, fare: 2.52 },
  { minDistance: 16.3, maxDistance: 17.2, fare: 2.56 },
  { minDistance: 17.3, maxDistance: 18.2, fare: 2.60 },
  { minDistance: 18.3, maxDistance: 19.2, fare: 2.64 },
  { minDistance: 19.3, maxDistance: 20.2, fare: 2.67 },
  { minDistance: 20.3, maxDistance: 21.2, fare: 2.70 },
  { minDistance: 21.3, maxDistance: 22.2, fare: 2.73 },
  { minDistance: 22.3, maxDistance: 23.2, fare: 2.76 },
  { minDistance: 23.3, maxDistance: 24.2, fare: 2.78 },
  { minDistance: 24.3, maxDistance: 25.2, fare: 2.80 },
  { minDistance: 25.3, maxDistance: 26.2, fare: 2.82 },
  { minDistance: 26.3, maxDistance: 27.2, fare: 2.83 },
  { minDistance: 27.3, maxDistance: 28.2, fare: 2.84 },
  { minDistance: 28.3, maxDistance: 29.2, fare: 2.85 },
  { minDistance: 29.3, maxDistance: 30.2, fare: 2.86 },
  { minDistance: 30.3, maxDistance: 31.2, fare: 2.87 },
  { minDistance: 31.3, maxDistance: 32.2, fare: 2.88 },
  { minDistance: 32.3, maxDistance: 33.2, fare: 2.89 },
  { minDistance: 33.3, maxDistance: 34.2, fare: 2.90 },
  { minDistance: 34.3, maxDistance: 35.2, fare: 2.91 },
  { minDistance: 35.3, maxDistance: 36.2, fare: 2.92 },
  { minDistance: 36.3, maxDistance: 37.2, fare: 2.93 },
  { minDistance: 37.3, maxDistance: 38.2, fare: 2.94 },
  { minDistance: 38.3, maxDistance: 39.2, fare: 2.95 },
  { minDistance: 39.3, maxDistance: 40.2, fare: 2.96 },
  { minDistance: 40.3, fare: 3.00 }  // For distances over 40.2 km
];

// Fare calculation functions
const calculateMRTFare = (distance) => {
  const fareEntry = mrtLrtFareTable.find(
    (entry) =>
      (entry.minDistance ? distance >= entry.minDistance : true) &&
      (entry.maxDistance ? distance <= entry.maxDistance : true)
  );
  return fareEntry ? fareEntry.fare : 0;
};

const calculateBusFare = (distance) => {
  const fareEntry = busFareTable.find(
    (entry) =>
      (entry.minDistance ? distance >= entry.minDistance : true) &&
      (entry.maxDistance ? distance <= entry.maxDistance : true)
  );
  return fareEntry ? fareEntry.fare : 0;
};

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
        <React.Fragment key={i}>
          {step.travelMode === "Walk" ? (
            <span className="text-sm">🚶‍♂️</span>
          ) : step.travelMode === "Subway" ? (
            <span className="text-sm">🚇</span>
          ) : step.travelMode === "Bus" ? (
            <span className="text-sm">🚍</span>
          ) : (
            <span className="text-sm">❓</span>
          )}
          {i < route.steps.length - 1 && <span className="text-sm">→</span>}
        </React.Fragment>
      ))}
    </div>
    <div className="flex flex-col items-end">
      <span className="text-lg font-semibold">${route.price.toFixed(2)}</span>
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
        let totalFare = 0;
  
        const steps = leg.steps.map((step) => {
          let travelMode = "Unknown";
          if (step.instructions) {
            const firstWord = step.instructions.split(" ")[0].toLowerCase();
            if (firstWord === "walk" || firstWord === "walking") {
              travelMode = "Walk";
            } else if (firstWord === "bus" || firstWord === "take") {
              travelMode = "Bus";
            } else if (firstWord === "subway" || firstWord === "train") {
              travelMode = "Subway";
            }
          }
  
          // Calculate fare based on travel mode
          let fare = 0;
          const distanceKm = step.distance.value / 1000; // Convert distance to kilometers
          const randomFactor = Math.random() * 0.1 - 0.05; // Random factor in the range [-0.05, 0.05]
  
          if (travelMode === "Walk") {
            fare = 0;
          } else if (travelMode === "Bus") {
            fare = calculateBusFare(distanceKm) / 2 + randomFactor; // Bus fare divided by 2 and adjusted by random factor
          } else if (travelMode === "Subway") {
            fare = calculateMRTFare(distanceKm) + randomFactor; // Subway fare adjusted by random factor
          }
          totalFare += fare;
  
          return {
            travelMode,
            instructions: step.instructions || "No instructions",
            duration: step.duration.text,
          };
        });
  
        return {
          index,
          duration: leg.duration.value,
          durationText: leg.duration.text,
          price: totalFare,
          steps,
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
    return sortOption === "time" ? a.duration - b.duration : a.price - b.price;
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