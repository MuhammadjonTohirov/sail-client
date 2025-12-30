"use client";

import { useState, useCallback } from 'react';

export interface GeolocationPosition {
  lat: number;
  lon: number;
  accuracy: number;
}

export interface UseGeolocationResult {
  position: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => Promise<GeolocationPosition | null>;
  isSupported: boolean;
}

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSupported = typeof window !== 'undefined' && 'geolocation' in navigator;

  const requestLocation = useCallback(async (): Promise<GeolocationPosition | null> => {
    if (!isSupported) {
      setError('Geolocation is not supported by your browser');
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const result: GeolocationPosition = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          setPosition(result);
          setLoading(false);
          resolve(result);
        },
        (err) => {
          let message: string;
          switch (err.code) {
            case err.PERMISSION_DENIED:
              message = 'permission_denied';
              break;
            case err.POSITION_UNAVAILABLE:
              message = 'position_unavailable';
              break;
            case err.TIMEOUT:
              message = 'timeout';
              break;
            default:
              message = 'unknown_error';
          }
          setError(message);
          setLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Cache for 1 minute
        }
      );
    });
  }, [isSupported]);

  return {
    position,
    error,
    loading,
    requestLocation,
    isSupported,
  };
}

export default useGeolocation;
