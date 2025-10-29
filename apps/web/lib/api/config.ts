// API Configuration for Web App
export const API_KEYS = {
  googleCivic: process.env.NEXT_PUBLIC_GOOGLE_CIVIC_API_KEY || 'AIzaSyD9rzLJCUqRSCi9mKpo0fxZ1ACxffe5mzc',
  googleMaps: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBmrjC59sSppSKvHl44oOJ3a7JGA1NKmKw',
  openStates: process.env.NEXT_PUBLIC_OPENSTATES_API_KEY || 'f7fa13bc-5611-4a03-a6d7-d3b6042f8e1e',
  legiScan: process.env.LEGISCAN_API_KEY || '',
};

// API Base URLs
export const API_URLS = {
  googleCivic: 'https://www.googleapis.com/civicinfo/v2',
  congress: 'https://api.congress.gov/v3',
  propublica: 'https://api.propublica.org/congress/v1',
  openStates: 'https://v3.openstates.org',
  legiScan: 'https://api.legiscan.com',
};

// Fetch with timeout
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}
