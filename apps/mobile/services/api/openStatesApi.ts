import { API_KEYS, API_URLS } from './config';

/**
 * OpenStates API Service
 * Provides methods to interact with the OpenStates API for state-level legislative data
 */

export interface OpenStatesLegislator {
  id: string;
  name: string;
  party: string;
  jurisdiction: {
    name: string;
    classification: string;
  };
  current_role: {
    title: string;
    org_classification: string;
    district: string | number;
    division_id: string;
  };
  image?: string;
  email?: string;
  capitol_voice?: string;
  district_voice?: string;
  capitol_address?: string;
  district_address?: string;
  links?: Array<{
    url: string;
    note: string;
  }>;
  sources?: Array<{
    url: string;
  }>;
  extras?: {
    [key: string]: any;
  };
}

export interface OpenStatesResponse {
  results: OpenStatesLegislator[];
  pagination: {
    page: number;
    max_page: number;
    per_page: number;
    total_items: number;
  };
}

/**
 * Fetch legislators by state
 * @param state - Two-letter state code (e.g., 'FL' for Florida)
 * @param chamber - Optional: 'upper' (Senate) or 'lower' (House)
 */
export async function fetchLegislatorsByState(
  state: string,
  chamber?: 'upper' | 'lower'
): Promise<OpenStatesLegislator[]> {
  try {
    let url = `${API_URLS.openStates}/people?jurisdiction=${state.toUpperCase()}`;
    
    if (chamber) {
      url += `&org_classification=${chamber}`;
    }
    
    console.log('Fetching OpenStates legislators:', url);
    
    const response = await fetch(url, {
      headers: {
        'X-API-KEY': API_KEYS.openStates || '',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenStates API error ${response.status}: ${errorText}`);
    }
    
    const data: OpenStatesResponse = await response.json();
    console.log(`Found ${data.results.length} legislators from OpenStates`);
    
    return data.results;
  } catch (error: any) {
    console.error('Error fetching OpenStates legislators:', error);
    throw new Error(`Failed to fetch legislators: ${error.message}`);
  }
}

/**
 * Fetch Florida senators specifically
 */
export async function fetchFloridaSenators(): Promise<OpenStatesLegislator[]> {
  return fetchLegislatorsByState('FL', 'upper');
}

/**
 * Fetch Florida house representatives
 */
export async function fetchFloridaHouseReps(): Promise<OpenStatesLegislator[]> {
  return fetchLegislatorsByState('FL', 'lower');
}

/**
 * Fetch all Florida legislators (both chambers)
 */
export async function fetchAllFloridaLegislators(): Promise<OpenStatesLegislator[]> {
  return fetchLegislatorsByState('FL');
}

/**
 * Search legislators by name
 * @param state - Two-letter state code
 * @param name - Name to search for
 */
export async function searchLegislators(
  state: string,
  name: string
): Promise<OpenStatesLegislator[]> {
  try {
    const url = `${API_URLS.openStates}/people?jurisdiction=${state.toUpperCase()}&name=${encodeURIComponent(name)}`;
    
    const response = await fetch(url, {
      headers: {
        'X-API-KEY': API_KEYS.openStates || '',
      },
    });
    
    if (!response.ok) {
      throw new Error(`OpenStates API error ${response.status}`);
    }
    
    const data: OpenStatesResponse = await response.json();
    return data.results;
  } catch (error: any) {
    console.error('Error searching legislators:', error);
    throw new Error(`Failed to search legislators: ${error.message}`);
  }
}

/**
 * Get legislator details by ID
 * @param id - OpenStates legislator ID
 */
export async function getLegislatorById(id: string): Promise<OpenStatesLegislator> {
  try {
    const url = `${API_URLS.openStates}/people/${id}`;
    
    const response = await fetch(url, {
      headers: {
        'X-API-KEY': API_KEYS.openStates || '',
      },
    });
    
    if (!response.ok) {
      throw new Error(`OpenStates API error ${response.status}`);
    }
    
    const data: OpenStatesLegislator = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching legislator details:', error);
    throw new Error(`Failed to fetch legislator: ${error.message}`);
  }
}
