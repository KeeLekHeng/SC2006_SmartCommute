import React, { useState, useCallback, useEffect } from "react";
import { useLocation, Link } from 'react-router-dom';
import { GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { getGrabFare, getGoTaxiFare, getGoCarFare, getGoCarXLFare, calculateBusFare, calculateMRTFare } from './fareCalculator';
import grabLogo from '../assets/grabLogo.png';
import goTaxiLogo from '../assets/goTaxi.png';
import Logo from '../assets/logo1.png';
import favouritesIcon from '../assets/fav.png';
import settingsIcon from '../assets/setttings.png';
import homeIcon from '../assets/home.png';

const RouteOption = ({ route, startLocation, destination, onHover, onLeave }) => (
  <div
    onMouseEnter={() => onHover(route.index)}
    onMouseLeave={onLeave}
    onClick={() =>
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destination)}&travelmode=transit`)
    }
    className="flex items-center justify-between p-4 border rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
  >
    <div className="flex items-center space-x-2">
      {route.steps.map((step, i) => (
        <React.Fragment key={i}>
          {step.travelMode === "Walk" ? (
            <span className="text-xl">🚶‍♂️</span> 
          ) : step.travelMode === "Subway" ? (
            <span className="text-xl">🚇</span> 
          ) : step.travelMode === "Bus" ? (
            <span className="text-xl">🚍</span> 
          ) : (
            <span className="text-xl">❓</span> 
          )}
          {i < route.steps.length - 1 && <span className="text-sm">→</span>}
        </React.Fragment>
      ))}
    </div>
    <div className="flex flex-col items-end">
      <span className="text-lg font-semibold">${parseFloat(route.price.toFixed(2))}</span>
      <span className="text-sm text-gray-600">{route.durationText}</span>
    </div>
  </div>
);

const formatDuration = (minutes) => {
  const roundedMinutes = Math.ceil(minutes);
  const hrs = Math.floor(roundedMinutes / 60);
  const mins = roundedMinutes % 60;
  return `${hrs > 0 ? `${hrs}h ` : ''}${mins} mins`;
};

const EHaulingOption = ({ type, fare, duration, onHover, onLeave, logo }) => (
  <div
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    onClick={() => {
      if (type.includes("Grab")) {
        if (/Android|Windows/i.test(navigator.userAgent)) {
          window.open("https://play.google.com/store/apps/details?id=com.grabtaxi.passenger&hl=en_SG", "_blank");
        } else if (/iPhone|iPad|iPod|Mac/i.test(navigator.userAgent)) {
          window.open("https://apps.apple.com/sg/app/grab-taxi-ride-food-delivery/id647268330", "_blank");
        } else {
          alert('Grab app link is only supported on mobile devices.');
        }
      } else if (type.includes("Go")) {
        if (/Android|Windows/i.test(navigator.userAgent)) {
          window.open("https://play.google.com/store/apps/details?id=com.gojek.app", "_blank");
        } else if (/iPhone|iPad|iPod|Mac/i.test(navigator.userAgent)) {
          window.open("https://apps.apple.com/sg/app/gojek/id944875099", "_blank");
        } else {
          alert('Gojek app link is only supported on mobile devices.');
        }
      }
    }}
    className="flex items-center justify-between p-4 border rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
  >
    <div className="flex items-center space-x-2">
      <img src={logo} alt={type} className="w-20 h-12" />
      <span className="text-lg font-semibold">{type}</span>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-lg font-semibold">${fare}</span>
      <span className="text-sm text-gray-600">{formatDuration(duration)}</span>
    </div>
  </div>
);

const ComparisonPage = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [sortOption, setSortOption] = useState("time");
  const [routes, setRoutes] = useState([]);
  const [hoveredRouteIndex, setHoveredRouteIndex] = useState(null);
  const [ehailingOptionHovered, setEHailingOptionHovered] = useState(false);
  const [ehailingOptions, setEHailingOptions] = useState([]);
  const [carRouteData, setCarRouteData] = useState(null);

  const [directionsFetched, setDirectionsFetched] = useState(false);

  const location = useLocation();
  const { startLocation, destination } = location.state || {};

  const isPeakPeriod = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    if (day >= 1 && day <= 5) {
      if ((currentTime >= 360 && currentTime <= 569) || (currentTime >= 1020 && currentTime <= 1439)) {
        return true;
      }
    } else {
      if ((currentTime >= 600 && currentTime <= 839) || (currentTime >= 1020 && currentTime <= 1439)) {
        return true;
      }
    }
    return false;
  };

  const directionsCallback = useCallback((response) => {
    if (response && response.status === "OK" && !directionsFetched) {
      const processedRoutes = response.routes.slice(0, 3).map((route, index) => {
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

  const handleCarCallback = useCallback((response) => {
    if (response && response.status === "OK" && response.routes.length > 0) {
      const leg = response.routes[0].legs[0];
      setCarRouteData(response);

      const durationInMinutes = leg.duration.value / 60;
      const distanceInKm = leg.distance.value / 1000;

      const grab4Seater = getGrabFare(durationInMinutes, distanceInKm, false, isPeakPeriod());
      const grab6Seater = getGrabFare(durationInMinutes, distanceInKm, true, isPeakPeriod());
      const goTaxi = getGoTaxiFare(durationInMinutes, distanceInKm, isPeakPeriod());
      const goCar = getGoCarFare(distanceInKm, isPeakPeriod());
      const goCarXL = getGoCarXLFare(distanceInKm, isPeakPeriod());

      setEHailingOptions([
        { ...grab4Seater, duration: durationInMinutes, type: "Grab 4-seater", logo: grabLogo },
        { ...grab6Seater, duration: durationInMinutes, type: "Grab 6-seater", logo: grabLogo },
        { ...goTaxi, duration: durationInMinutes, type: "GoTaxi", logo: goTaxiLogo },
        { ...goCar, duration: durationInMinutes, type: "GoCar 4-seater", logo: goTaxiLogo },
        { ...goCarXL, duration: durationInMinutes, type: "GoCar XL 6-seater", logo: goTaxiLogo },
      ]);
    }
  }, []);

  useEffect(() => {
    if (startLocation && destination) {
      setCarRouteData(null);
      setDirectionsResponse(null);
      setEHailingOptions([]);
      setHoveredRouteIndex(null);
      setEHailingOptionHovered(false);
    }
  }, [startLocation, destination]);

  const handleHover = (index, isEHauling) => {
    if (index !== null) {
      if (isEHauling) {
        setHoveredRouteIndex(null);
        setEHailingOptionHovered(true);
      } else {
        setEHailingOptionHovered(false);
        setHoveredRouteIndex(index);
      }
    } else {
      setHoveredRouteIndex(null);
      setEHailingOptionHovered(false);
    }
  };

  const combinedOptions = [...routes, ...ehailingOptions].sort((a, b) => {
    if (sortOption === "time") {
      if (a.duration === b.duration) {
        const priceA = parseFloat(a.price || a.fare) || 0;
        const priceB = parseFloat(b.price || b.fare) || 0;
        return priceA - priceB;
      }
      return a.duration - b.duration;
    } else if (sortOption === "price") {
      const priceA = parseFloat(a.price || a.fare) || 0;
      const priceB = parseFloat(b.price || b.fare) || 0;
      return priceA - priceB;
    }
    return 0;
  });

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-24 bg-[#4169E1] text-white z-50 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-18 h-14 mr-4" />
          <span className="text-2xl font-bold">SmartCommute</span>
        </div>
        <div className="flex space-x-44">
          <div className="flex flex-col items-center">
            <img src={homeIcon} alt="Home" className="w-14 h-14" />
            <Link to="/main" className="hover:underline text-lg font-semibold transition pb-2 text-white">
              Home
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <img src={favouritesIcon} alt="Favourites" className="w-12 h-12 mb-2" />
            <Link to="/favourites" className="hover:underline text-lg font-semibold transition pb-2 text-white">
              Favourites
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <img src={settingsIcon} alt="Settings" className="w-14 h-14" />
            <Link to="/settings" className="hover:underline text-lg font-semibold transition pb-2 text-white">
              Settings
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 p-4 mt-24 flex flex-col md:flex-row items-start">
        {/* Google Map on the left */}
        {startLocation && destination && (
          <div className="w-1/2 h-full">
            <GoogleMap
              center={{ lat: 1.3483, lng: 103.6831 }}
              zoom={14}
              mapContainerStyle={{ width: "100%", height: "calc(100vh - 8rem)" }}
            >
              {!carRouteData && (
                <DirectionsService
                  options={{
                    origin: startLocation,
                    destination: destination,
                    travelMode: "DRIVING",
                  }}
                  callback={handleCarCallback}
                />
              )}
              {!directionsResponse && (
                <DirectionsService
                  options={{
                    origin: startLocation,
                    destination: destination,
                    travelMode: "TRANSIT",
                    provideRouteAlternatives: true,
                  }}
                  callback={directionsCallback}
                />
              )}
              {ehailingOptionHovered && carRouteData && (
                <DirectionsRenderer directions={carRouteData} />
              )}
              {!ehailingOptionHovered && hoveredRouteIndex !== null && directionsResponse && directionsResponse.routes[hoveredRouteIndex] && (
                <DirectionsRenderer
                  directions={{ ...directionsResponse, routes: [directionsResponse.routes[hoveredRouteIndex]] }}
                />
              )}
            </GoogleMap>
          </div>
        )}

        {/* Route options container on the right */}
        <div className="pt-28 pb-24 flex-1 flex justify-center items-center px-4">
          <div className="bg-white p-5 rounded-lg w-full max-w-3xl shadow-lg overflow-y-auto relative h-[70vh] -translate-y-10">
            <div className="w-full md:w- flex flex-col items-center">
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
                {combinedOptions.map((option, index) => (
                  option.type && (option.type.includes("Grab") || option.type.includes("Go")) ? (
                    <EHaulingOption
                      key={index}
                      type={option.type}
                      fare={option.fare}
                      duration={option.duration}
                      logo={option.logo}
                      onHover={() => handleHover(index, true)} // Pass true for e-hauling options
                      onLeave={() => handleHover(null, true)} // Clear when not hovered
                    />
                  ) : (
                    <RouteOption
                      key={index}
                      route={option}
                      startLocation={startLocation}
                      destination={destination}
                      onHover={() => handleHover(option.index, false)} // Pass false for public transport options
                      onLeave={() => handleHover(null, false)} // Clear when not hovered
                    />
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-16 bg-[#4169E1] text-white text-center flex items-center justify-center">
        <Link to="/review" className="hover:underline text-lg text-white">
          <i className="material-icons text-yellow-500 mr-4">star</i>
          Leave us a review
          <i className="material-icons text-yellow-500 ml-4">star</i>
        </Link>
      </footer>
    </div>
  );
};

export default ComparisonPage;