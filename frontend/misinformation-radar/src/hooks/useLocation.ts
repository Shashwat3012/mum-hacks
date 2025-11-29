import { useState, useEffect } from 'react';

export interface Location {
  lat: number;
  lng: number;
  city: string;
  state: string;
  country: string;
  loading: boolean;
  error: string | null;
}

export const useLocation = (): Location => {
  const [location, setLocation] = useState<Location>({
    lat: 0,
    lng: 0,
    city: 'Unknown',
    state: 'Unknown',
    country: 'Unknown',
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get city and state
          // Using Nominatim (OpenStreetMap) - free and no API key required
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          
          const data = await response.json();
          const address = data.address || {};
          
          setLocation({
            lat: latitude,
            lng: longitude,
            city: address.city || address.town || address.village || 'Unknown',
            state: address.state || 'Unknown',
            country: address.country || 'Unknown',
            loading: false,
            error: null,
          });
        } catch (error) {
          // If reverse geocoding fails, still set coordinates
          setLocation({
            lat: latitude,
            lng: longitude,
            city: 'Unknown',
            state: 'Unknown',
            country: 'Unknown',
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: `Unable to retrieve location: ${error.message}`,
        }));
      }
    );
  }, []);

  return location;
};
