// grabFareCalculator.js
export const getGrabFare = (minutes, distance, isSixSeater = false) => {
    const baseFare = isSixSeater ? 4.0 : 2.5;
    const perKmRate = isSixSeater ? 0.83 : 0.5;
    const perMinRate = isSixSeater ? 0.26 : 0.16;
  
    let totalFare = baseFare + (perKmRate * distance) + (perMinRate * minutes);
    
    return {
      type: isSixSeater ? "Grab 6-Seater Economy" : "Grab 4-Seater Economy",
      fare: totalFare.toFixed(2),
      minutes,
    };
  };

  export function getGoTaxiFare(durationInMinutes, distanceInKm, isPeakPeriod) {
    const flagdownFare = 3.55; // Average of S$3.20–S$3.90
    const platformFee = 0.80;
    const bookingFee = isPeakPeriod ? 4.00 : 2.40; // Average booking fee for peak and non-peak
    let distanceFare = 0;
  
    if (distanceInKm <= 10) {
      distanceFare = distanceInKm * (0.25 * 1000 / 400); // S$0.25 per 400m
    } else {
      distanceFare = (10 * (0.25 * 1000 / 400)) + ((distanceInKm - 10) * (0.25 * 1000 / 350)); // S$0.25 per 350m after 10km
    }
  
    const totalFare = flagdownFare + bookingFee + distanceFare + platformFee;
    return {
      fare: totalFare.toFixed(2),
      type: 'GoTaxi'
    };
  }


// grabFareCalculator.js

export function getGoCarFare(distanceInKm) {
    // Base fare estimation for GoCar 4-seater
    const baseFare = 1.5; // Starting fare for GoCar
    const distanceFare = distanceInKm * 0.50; // $0.50 per km
    const platformFee = 0.80; // Average platform fee between $0.60 and $1.00
    const transactionFee = Math.min(0.60, Math.max(0.10, distanceInKm * 0.05)); // $0.10 to $0.60
  
    const totalFare = baseFare + distanceFare + platformFee + transactionFee;
    return {
      fare: totalFare.toFixed(2),
      type: 'GoCar 4-seater',
    };
  }
  
  export function getGoCarXLFare(distanceInKm) {
    // Base fare estimation for GoCar XL 6-seater (30-60% higher)
    const baseFare = 1.5 * 1.45; // 45% higher for XL
    const distanceFare = distanceInKm * 0.50 * 1.45; // 45% higher per km
    const platformFee = 0.80; // Average platform fee between $0.60 and $1.00
    const transactionFee = Math.min(0.60, Math.max(0.10, distanceInKm * 0.05)); // $0.10 to $0.60
  
    const totalFare = baseFare + distanceFare + platformFee + transactionFee;
    return {
      fare: totalFare.toFixed(2),
      type: 'GoCar XL 6-seater',
    };
  }
  
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
  export const calculateMRTFare = (distance) => {
    const fareEntry = mrtLrtFareTable.find(
      (entry) =>
        (entry.minDistance ? distance >= entry.minDistance : true) &&
        (entry.maxDistance ? distance <= entry.maxDistance : true)
    );
    return fareEntry ? fareEntry.fare : 0;
  };
  
  export const calculateBusFare = (distance) => {
    const fareEntry = busFareTable.find(
      (entry) =>
        (entry.minDistance ? distance >= entry.minDistance : true) &&
        (entry.maxDistance ? distance <= entry.maxDistance : true)
    );
    return fareEntry ? fareEntry.fare : 0;
  };
  
  