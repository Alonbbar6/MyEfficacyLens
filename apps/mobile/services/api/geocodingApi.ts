import { API_KEYS, API_URLS } from './config';
import { fetchRepresentatives } from './civicApi';
import { UserLocation } from '../../types';

/**
 * Geocoding and Location Service
 * Processes user location input and determines districts
 */

export interface GeocodeResult {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  stateCode?: string;
  county?: string;
  zipCode?: string;
}

/**
 * Manually parse address when Google Maps API is not available
 * This is a fallback solution
 */
function parseAddressManually(address: string): GeocodeResult {
  console.log('Parsing address manually:', address);
  
  // Normalize input
  const normalizedInput = address.trim();
  
  // Extract zip code
  const zipMatch = normalizedInput.match(/\b(\d{5})\b/);
  const zipCode = zipMatch ? zipMatch[1] : undefined;
  
  // Extract state code (2 letters)
  const stateCodeMatch = normalizedInput.match(/\b([A-Z]{2})\b/);
  let stateCode = stateCodeMatch ? stateCodeMatch[1] : undefined;
  
  // Extract city (text before comma or state)
  let city: string | undefined;
  const parts = normalizedInput.split(',');
  if (parts.length > 0) {
    city = parts[0].trim().replace(/^\d+\s+/, ''); // Remove street number
  }
  
  // Map state code to full state name
  const stateNames: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia',
  };
  
  // Check if input is just a state name (e.g., "Alabama")
  const stateNameToCode: Record<string, string> = Object.fromEntries(
    Object.entries(stateNames).map(([code, name]) => [name.toLowerCase(), code])
  );
  
  if (!stateCode) {
    const inputLower = normalizedInput.toLowerCase();
    stateCode = stateNameToCode[inputLower];
    if (stateCode) {
      console.log(`Detected state name "${normalizedInput}" as ${stateCode}`);
    }
  }
  
  const state = stateCode ? stateNames[stateCode] : undefined;
  
  // Get approximate coordinates for state (center of state)
  const stateCoordinates: Record<string, { lat: number; lng: number }> = {
    'AL': { lat: 32.3182, lng: -86.9023 }, 'AK': { lat: 64.2008, lng: -149.4937 },
    'AZ': { lat: 34.0489, lng: -111.0937 }, 'AR': { lat: 35.2010, lng: -91.8318 },
    'CA': { lat: 36.7783, lng: -119.4179 }, 'CO': { lat: 39.5501, lng: -105.7821 },
    'CT': { lat: 41.6032, lng: -73.0877 }, 'DE': { lat: 38.9108, lng: -75.5277 },
    'FL': { lat: 27.9944, lng: -81.7603 }, 'GA': { lat: 32.1656, lng: -82.9001 },
    'HI': { lat: 19.8968, lng: -155.5828 }, 'ID': { lat: 44.0682, lng: -114.7420 },
    'IL': { lat: 40.6331, lng: -89.3985 }, 'IN': { lat: 40.2672, lng: -86.1349 },
    'IA': { lat: 41.8780, lng: -93.0977 }, 'KS': { lat: 39.0119, lng: -98.4842 },
    'KY': { lat: 37.8393, lng: -84.2700 }, 'LA': { lat: 30.9843, lng: -91.9623 },
    'ME': { lat: 45.2538, lng: -69.4455 }, 'MD': { lat: 39.0458, lng: -76.6413 },
    'MA': { lat: 42.4072, lng: -71.3824 }, 'MI': { lat: 44.3148, lng: -85.6024 },
    'MN': { lat: 46.7296, lng: -94.6859 }, 'MS': { lat: 32.3547, lng: -89.3985 },
    'MO': { lat: 37.9643, lng: -91.8318 }, 'MT': { lat: 46.8797, lng: -110.3626 },
    'NE': { lat: 41.4925, lng: -99.9018 }, 'NV': { lat: 38.8026, lng: -116.4194 },
    'NH': { lat: 43.1939, lng: -71.5724 }, 'NJ': { lat: 40.0583, lng: -74.4057 },
    'NM': { lat: 34.5199, lng: -105.8701 }, 'NY': { lat: 43.2994, lng: -74.2179 },
    'NC': { lat: 35.7596, lng: -79.0193 }, 'ND': { lat: 47.5515, lng: -101.0020 },
    'OH': { lat: 40.4173, lng: -82.9071 }, 'OK': { lat: 35.4676, lng: -97.5164 },
    'OR': { lat: 43.8041, lng: -120.5542 }, 'PA': { lat: 41.2033, lng: -77.1945 },
    'RI': { lat: 41.5801, lng: -71.4774 }, 'SC': { lat: 33.8361, lng: -81.1637 },
    'SD': { lat: 43.9695, lng: -99.9018 }, 'TN': { lat: 35.5175, lng: -86.5804 },
    'TX': { lat: 31.9686, lng: -99.9018 }, 'UT': { lat: 39.3210, lng: -111.0937 },
    'VT': { lat: 44.5588, lng: -72.5778 }, 'VA': { lat: 37.4316, lng: -78.6569 },
    'WA': { lat: 47.7511, lng: -120.7401 }, 'WV': { lat: 38.5976, lng: -80.4549 },
    'WI': { lat: 43.7844, lng: -88.7879 }, 'WY': { lat: 43.0750, lng: -107.2903 },
    'DC': { lat: 38.9072, lng: -77.0369 },
  };
  
  const coords = stateCode ? stateCoordinates[stateCode] || { lat: 39.8283, lng: -98.5795 } : { lat: 39.8283, lng: -98.5795 };
  
  // Build formatted address
  let formattedAddress: string;
  if (city && stateCode) {
    formattedAddress = zipCode ? `${city}, ${stateCode} ${zipCode}` : `${city}, ${stateCode}`;
  } else if (stateCode) {
    // State only
    formattedAddress = state || stateCode;
  } else if (zipCode) {
    formattedAddress = zipCode;
  } else {
    formattedAddress = normalizedInput;
  }
  
  return {
    formattedAddress: formattedAddress || address,
    latitude: coords.lat,
    longitude: coords.lng,
    city,
    state,
    stateCode,
    zipCode,
  };
}

/**
 * Geocode an address using Google Maps Geocoding API
 * Falls back to simple parsing if API is not available
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  try {
    // Try Google Maps API first
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEYS.googleMaps}`;
    
    console.log('Geocoding address:', address);
    
    const response = await fetch(url);
    const data = await response.json();
    
    // If API is not authorized, fall back to simple parsing
    if (data.status === 'REQUEST_DENIED' || data.error_message?.includes('not authorized')) {
      console.warn('Google Maps API not authorized, using fallback parsing');
      return parseAddressManually(address);
    }
    
    if (!response.ok || data.status !== 'OK') {
      throw new Error(data.error_message || `Geocoding failed: ${data.status}`);
    }
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No results found for this address');
    }
    
    const result = data.results[0];
    const location = result.geometry.location;
    
    // Extract address components
    let city: string | undefined;
    let state: string | undefined;
    let stateCode: string | undefined;
    let county: string | undefined;
    let zipCode: string | undefined;
    
    result.address_components.forEach((component: any) => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
        stateCode = component.short_name;
      }
      if (component.types.includes('administrative_area_level_2')) {
        county = component.long_name;
      }
      if (component.types.includes('postal_code')) {
        zipCode = component.short_name;
      }
    });
    
    console.log('Geocoded successfully:', {
      city,
      state: stateCode,
      zipCode,
    });
    
    return {
      formattedAddress: result.formatted_address,
      latitude: location.lat,
      longitude: location.lng,
      city,
      state,
      stateCode,
      county,
      zipCode,
    };
  } catch (error: any) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to geocode address: ${error.message}`);
  }
}

/**
 * Get congressional and state legislative districts for a location
 */
export async function getDistrictsForLocation(address: string): Promise<{
  congressionalDistrict?: string;
  stateSenateDistrict?: string;
  stateHouseDistrict?: string;
}> {
  try {
    console.log('Fetching districts for:', address);
    
    // Use Google Civic API to get district information
    const data = await fetchRepresentatives(address);
    
    let congressionalDistrict: string | undefined;
    let stateSenateDistrict: string | undefined;
    let stateHouseDistrict: string | undefined;
    
    // Parse divisions to extract district numbers
    if (data.divisions) {
      Object.keys(data.divisions).forEach((divisionId) => {
        // Congressional district: ocd-division/country:us/state:fl/cd:27
        if (divisionId.includes('/cd:')) {
          const match = divisionId.match(/\/cd:(\d+)/);
          if (match) {
            const stateMatch = divisionId.match(/\/state:(\w+)/);
            const stateCode = stateMatch ? stateMatch[1].toUpperCase() : '';
            congressionalDistrict = `${stateCode}-${match[1]}`;
          }
        }
        
        // State senate district: ocd-division/country:us/state:fl/sldu:37
        if (divisionId.includes('/sldu:')) {
          const match = divisionId.match(/\/sldu:(\d+)/);
          if (match) {
            stateSenateDistrict = match[1];
          }
        }
        
        // State house district: ocd-division/country:us/state:fl/sldl:116
        if (divisionId.includes('/sldl:')) {
          const match = divisionId.match(/\/sldl:(\d+)/);
          if (match) {
            stateHouseDistrict = match[1];
          }
        }
      });
    }
    
    // Also check offices for district information
    data.offices?.forEach((office: any) => {
      if (office.name.includes('U.S. Representative')) {
        const districtMatch = office.name.match(/District (\d+)/i);
        if (districtMatch && !congressionalDistrict) {
          congressionalDistrict = districtMatch[1];
        }
      }
    });
    
    console.log('Districts found:', {
      congressionalDistrict,
      stateSenateDistrict,
      stateHouseDistrict,
    });
    
    return {
      congressionalDistrict,
      stateSenateDistrict,
      stateHouseDistrict,
    };
  } catch (error: any) {
    console.warn('Failed to fetch districts:', error.message);
    // Return empty districts if API fails
    return {};
  }
}

/**
 * Process user location input and return complete location data
 */
export async function processLocationInput(input: string): Promise<UserLocation> {
  try {
    console.log('Processing location input:', input);
    
    // Step 1: Geocode the address
    const geocodeResult = await geocodeAddress(input);
    
    // Step 2: Get districts (optional, may fail)
    let districts = {};
    try {
      districts = await getDistrictsForLocation(geocodeResult.formattedAddress);
    } catch (error) {
      console.warn('Could not fetch districts, continuing without them');
    }
    
    // Step 3: Combine all data
    const location: UserLocation = {
      address: input,
      formattedAddress: geocodeResult.formattedAddress,
      city: geocodeResult.city,
      state: geocodeResult.state,
      stateCode: geocodeResult.stateCode,
      county: geocodeResult.county,
      zipCode: geocodeResult.zipCode,
      latitude: geocodeResult.latitude,
      longitude: geocodeResult.longitude,
      ...districts,
    };
    
    console.log('Location processed successfully:', location);
    
    return location;
  } catch (error: any) {
    console.error('Location processing error:', error);
    throw new Error(`Failed to process location: ${error.message}`);
  }
}

/**
 * Validate that location is in the United States
 */
export function isUSLocation(location: GeocodeResult): boolean {
  // Check if state code is a valid US state
  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC', // Washington DC
  ];
  
  return location.stateCode ? usStates.includes(location.stateCode) : false;
}

/**
 * Get current device location using Expo Location
 * Note: Requires expo-location package
 */
export async function getCurrentDeviceLocation(): Promise<UserLocation> {
  try {
    // This will be implemented when we add expo-location
    // For now, throw an error to indicate it's not available
    throw new Error('Device location not yet implemented. Please enter your address manually.');
  } catch (error: any) {
    throw new Error(`Failed to get device location: ${error.message}`);
  }
}
