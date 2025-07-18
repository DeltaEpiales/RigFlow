import { useState } from 'react';

// This is a mock location for demonstration purposes.
// It places the user just inside the Midland, TX job site fence.
const MOCK_USER_LOCATION = {
    latitude: 31.9995,
    longitude: -102.0779,
}

export const useGeolocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getPosition = () => {
        setLoading(true);
        setError(null);
        setLocation(null);

        // In a real app, this would use the device's GPS via navigator.geolocation.getCurrentPosition
        // For this prototype, we return a mock location immediately.
        setTimeout(() => {
            setLocation(MOCK_USER_LOCATION);
            setLoading(false);
        }, 500);
    };

    return { location, error, loading, getPosition };
};

export const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; 
};

export const isWithinGeofence = (userLocation, job) => {
    if (!userLocation || !job?.geoFence) return false;
    
    const distance = getDistanceInMeters(
        userLocation.latitude,
        userLocation.longitude,
        job.geoFence.lat,
        job.geoFence.lon
    );
    
    return distance <= job.geoFence.radius;
};
