/**
 * Shared API URL Constants
 */

export const API_URLS = {
  // Google Civic Information API
  googleCivic: 'https://www.googleapis.com/civicinfo/v2',
  
  // OpenStates API
  openStates: 'https://v3.openstates.org',
  
  // Google Maps API
  googleMaps: 'https://maps.googleapis.com/maps/api',
  
  // Internal API (will be different for web vs mobile)
  // These should be overridden by environment variables
  api: process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
};

export const API_ENDPOINTS = {
  // Politicians
  politicians: '/api/politicians',
  politicianById: (id: string) => `/api/politicians/${id}`,
  
  // Bills
  bills: '/api/bills',
  billById: (id: string) => `/api/bills/${id}`,
  
  // Events
  events: '/api/events',
  eventById: (id: string) => `/api/events/${id}`,
  
  // User
  user: '/api/user',
  userPreferences: '/api/user/preferences',
};
