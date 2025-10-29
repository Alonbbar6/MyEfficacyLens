import axios from 'axios';
import Constants from 'expo-constants';

// API Configuration
export const API_KEYS = {
  googleCivic: Constants.expoConfig?.extra?.googleCivicApi || process.env.EXPO_PUBLIC_GOOGLE_CIVIC_API,
  googleMaps: Constants.expoConfig?.extra?.googleMapsApi || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API,
  openStates: Constants.expoConfig?.extra?.openStatesApi || process.env.EXPO_PUBLIC_OPENSTATES_API,
};

// API Base URLs
export const API_URLS = {
  googleCivic: 'https://www.googleapis.com/civicinfo/v2',
  congress: 'https://api.congress.gov/v3',
  propublica: 'https://api.propublica.org/congress/v1',
  openStates: 'https://v3.openstates.org',
};

// Create axios instance with default config
export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);
