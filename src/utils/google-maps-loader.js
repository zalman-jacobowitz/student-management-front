import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

let isGoogleMapsLoaded = false;
let googleMapsPromise = null;

export const loadGoogleMapsAPI = () => {
  if (isGoogleMapsLoaded) {
    return Promise.resolve();
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    if (!CONFIG.googleMapsApiKey) {
      console.warn('Google Maps API key is not configured');
      resolve();
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      isGoogleMapsLoaded = true;
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.googleMapsApiKey}&libraries=places&language=he`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isGoogleMapsLoaded = true;
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export const isGoogleMapsAPILoaded = () => isGoogleMapsLoaded;