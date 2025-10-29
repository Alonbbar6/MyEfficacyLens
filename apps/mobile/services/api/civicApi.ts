import { API_KEYS, API_URLS } from './config';

/**
 * Google Civic Information API Service
 * Provides methods to interact with the Google Civic Information API
 */

export interface Election {
  id: string;
  name: string;
  electionDay: string;
  ocdDivisionId?: string;
}

export interface Official {
  name: string;
  party?: string;
  phones?: string[];
  emails?: string[];
  photoUrl?: string;
  urls?: string[];
  channels?: Array<{
    type: string;
    id: string;
  }>;
  address?: Array<{
    line1?: string;
    line2?: string;
    line3?: string;
    city?: string;
    state?: string;
    zip?: string;
  }>;
}

export interface Office {
  name: string;
  divisionId: string;
  levels?: string[];
  roles?: string[];
  officialIndices: number[];
}

export interface RepresentativesResponse {
  normalizedInput?: {
    line1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  kind: string;
  divisions?: Record<string, any>;
  offices: Office[];
  officials: Official[];
}

export interface ElectionsResponse {
  kind: string;
  elections: Election[];
}

/**
 * Fetch all available elections
 */
export async function fetchElections(): Promise<ElectionsResponse> {
  const url = `${API_URLS.googleCivic}/elections?key=${API_KEYS.googleCivic}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || `API returned ${response.status}`);
  }
  
  return data;
}

/**
 * Fetch representatives for a given address
 * @param address - Full address string (e.g., "1600 Pennsylvania Ave NW, Washington, DC 20500")
 * @param levels - Optional array of government levels (e.g., ['country', 'administrativeArea1'])
 * @param roles - Optional array of roles (e.g., ['legislatorUpperBody', 'legislatorLowerBody'])
 */
export async function fetchRepresentatives(
  address: string,
  levels?: string[],
  roles?: string[]
): Promise<RepresentativesResponse> {
  let url = `${API_URLS.googleCivic}/representatives?address=${encodeURIComponent(address)}&key=${API_KEYS.googleCivic}`;
  
  if (levels && levels.length > 0) {
    url += `&levels=${levels.join(',')}`;
  }
  
  if (roles && roles.length > 0) {
    url += `&roles=${roles.join(',')}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || `API returned ${response.status}`);
  }
  
  return data;
}

/**
 * Fetch voter information for a specific election and address
 * @param address - Full address string
 * @param electionId - Election ID (optional, defaults to latest election)
 */
export async function fetchVoterInfo(
  address: string,
  electionId?: string
): Promise<any> {
  let url = `${API_URLS.googleCivic}/voterinfo?address=${encodeURIComponent(address)}&key=${API_KEYS.googleCivic}`;
  
  if (electionId) {
    url += `&electionId=${electionId}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || `API returned ${response.status}`);
  }
  
  return data;
}

/**
 * Helper function to get officials by office name
 */
export function getOfficialsByOffice(
  data: RepresentativesResponse,
  officeName: string
): Official[] {
  const office = data.offices.find(o => o.name === officeName);
  if (!office) return [];
  
  return office.officialIndices.map(index => data.officials[index]);
}

/**
 * Helper function to get all federal representatives
 */
export function getFederalRepresentatives(data: RepresentativesResponse): {
  office: Office;
  official: Official;
}[] {
  const federalOffices = data.offices.filter(
    office => office.levels?.includes('country')
  );
  
  const result: { office: Office; official: Official }[] = [];
  
  federalOffices.forEach(office => {
    office.officialIndices.forEach(index => {
      result.push({
        office,
        official: data.officials[index],
      });
    });
  });
  
  return result;
}

/**
 * Helper function to get all state representatives
 */
export function getStateRepresentatives(data: RepresentativesResponse): {
  office: Office;
  official: Official;
}[] {
  const stateOffices = data.offices.filter(
    office => office.levels?.includes('administrativeArea1')
  );
  
  const result: { office: Office; official: Official }[] = [];
  
  stateOffices.forEach(office => {
    office.officialIndices.forEach(index => {
      result.push({
        office,
        official: data.officials[index],
      });
    });
  });
  
  return result;
}

/**
 * Helper function to get all local representatives
 */
export function getLocalRepresentatives(data: RepresentativesResponse): {
  office: Office;
  official: Official;
}[] {
  const localOffices = data.offices.filter(
    office => office.levels?.includes('locality') || office.levels?.includes('administrativeArea2')
  );
  
  const result: { office: Office; official: Official }[] = [];
  
  localOffices.forEach(office => {
    office.officialIndices.forEach(index => {
      result.push({
        office,
        official: data.officials[index],
      });
    });
  });
  
  return result;
}
