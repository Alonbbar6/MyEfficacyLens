import { API_KEYS } from './config';
import { fetchRepresentatives } from './civicApi';
import { fetchLegislatorsByState, OpenStatesLegislator } from './openStatesApi';

export interface Politician {
  id: string;
  name: string;
  position: string;
  party: 'Democrat' | 'Republican' | 'Independent' | 'Other';
  level: 'Federal' | 'State' | 'Local';
  photo?: string;
  phone?: string;
  email?: string;
  website?: string;
  district?: string;
  officeAddress?: string;
  biography?: string;
  committees?: string[];
  votingRecordSummary?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export const politiciansApi = {
  // Get representatives by address
  getRepresentativesByAddress: async (address: string): Promise<Politician[]> => {
    try {
      console.log('Fetching representatives for address:', address);
      
      // Try to parse state from input (handles state names, abbreviations, city/state combos)
      let state = parseStateFromInput(address);
      
      // If no state found yet, try zip code
      if (!state) {
        const zipMatch = address.match(/\b(\d{5})\b/);
        if (zipMatch) {
          state = getStateFromZip(zipMatch[1]);
        }
      }
      
      console.log('Detected state:', state);
      
      let politicians: Politician[] = [];
      
      // Try Google Civic API first (for federal officials)
      // Note: This may fail if the API key is not configured or the API is not enabled
      try {
        const data = await fetchRepresentatives(address);
        const { offices = [], officials = [] } = data;
        
        console.log(`Found ${offices.length} offices and ${officials.length} officials from Google Civic`);
        
        offices.forEach((office: any) => {
          const officialIndices = office.officialIndices || [];
          officialIndices.forEach((index: number) => {
            const official = officials[index];
            if (official) {
              const politician: Politician = {
                id: `civic-${office.name}-${official.name}`.replace(/\s/g, '-').toLowerCase(),
                name: official.name,
                position: office.name,
                party: mapParty(official.party),
                level: mapLevel(office.levels?.[0]),
                photo: official.photoUrl,
                phone: official.phones?.[0],
                email: official.emails?.[0],
                website: official.urls?.[0],
                district: office.divisionId?.split('/').pop()?.replace(/_/g, ' '),
                officeAddress: official.address?.[0]
                  ? formatAddress(official.address[0])
                  : undefined,
                socialMedia: {
                  twitter: official.channels?.find((c: any) => c.type === 'Twitter')?.id,
                  facebook: official.channels?.find((c: any) => c.type === 'Facebook')?.id,
                },
              };
              politicians.push(politician);
            }
          });
        });
      } catch (civicError: any) {
        console.warn('Google Civic API unavailable (showing state legislators only):', civicError.message);
        // Continue to fetch state legislators even if Google Civic fails
      }
      
      // Add state legislators from OpenStates if we have a state
      if (state && API_KEYS.openStates) {
        try {
          console.log(`Fetching state legislators for ${state} from OpenStates`);
          const stateLegislators = await fetchLegislatorsByState(state);
          console.log(`Found ${stateLegislators.length} state legislators from OpenStates`);
          
          const statePoliticians = stateLegislators.map((leg: OpenStatesLegislator) => ({
            id: `openstates-${leg.id}`,
            name: leg.name,
            position: leg.current_role?.title || 'State Legislator',
            party: mapParty(leg.party),
            level: 'State' as const,
            photo: leg.image,
            phone: leg.capitol_voice || leg.district_voice,
            email: leg.email,
            district: leg.current_role?.district?.toString(),
            officeAddress: leg.capitol_address || leg.district_address,
          }));
          
          politicians = [...politicians, ...statePoliticians];
        } catch (openStatesError: any) {
          console.warn('OpenStates API failed:', openStatesError.message);
        }
      }

      console.log(`Total mapped politicians: ${politicians.length}`);
      
      if (politicians.length === 0) {
        if (state) {
          throw new Error(`No legislators found for ${state}. The OpenStates API may not have data for this state yet.`);
        } else {
          throw new Error('Unable to detect state. Please enter a state name (e.g., "Florida"), state code (e.g., "FL"), city and state (e.g., "Miami, FL"), or zip code (e.g., "33183").');
        }
      }
      
      return politicians;
    } catch (error: any) {
      console.error('Error fetching representatives:', error);
      
      // Provide more helpful error messages
      if (error.message.includes('No legislators found') || error.message.includes('Unable to detect state')) {
        throw error; // Re-throw our custom message
      }
      
      throw new Error('Unable to find representatives. Please try entering your state name, city and state, or zip code.');
    }
  },
};

// Helper functions
function mapParty(party?: string): Politician['party'] {
  if (!party) return 'Other';
  const normalized = party.toLowerCase();
  if (normalized.includes('democrat')) return 'Democrat';
  if (normalized.includes('republican')) return 'Republican';
  if (normalized.includes('independent')) return 'Independent';
  return 'Other';
}

function mapLevel(level?: string): Politician['level'] {
  if (!level) return 'Local';
  if (level === 'country') return 'Federal';
  if (level === 'administrativeArea1') return 'State';
  return 'Local';
}

function formatAddress(address: any): string {
  const parts = [];
  if (address.line1) parts.push(address.line1);
  if (address.line2) parts.push(address.line2);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zip) parts.push(address.zip);
  return parts.join(', ');
}

function getStateFromZip(zip: string): string | null {
  // Map zip code ranges to states (simplified version)
  const zipNum = parseInt(zip);
  
  if (zipNum >= 33000 && zipNum <= 34999) return 'FL'; // Florida
  if (zipNum >= 20000 && zipNum <= 20599) return 'DC'; // Washington DC
  if (zipNum >= 10000 && zipNum <= 14999) return 'NY'; // New York
  if (zipNum >= 90000 && zipNum <= 96699) return 'CA'; // California
  if (zipNum >= 75000 && zipNum <= 79999) return 'TX'; // Texas
  if (zipNum >= 60000 && zipNum <= 62999) return 'IL'; // Illinois
  if (zipNum >= 30000 && zipNum <= 31999) return 'GA'; // Georgia
  if (zipNum >= 85000 && zipNum <= 86999) return 'AZ'; // Arizona
  if (zipNum >= 98000 && zipNum <= 99499) return 'WA'; // Washington
  if (zipNum >= 2000 && zipNum <= 2799) return 'MA'; // Massachusetts
  
  return null;
}

function parseStateFromInput(input: string): string | null {
  // Map of state names to abbreviations
  const stateMap: Record<string, string> = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
    'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC', 'dc': 'DC'
  };

  const normalized = input.toLowerCase().trim();
  
  // Check if it's already a state abbreviation
  if (/^[A-Z]{2}$/i.test(normalized)) {
    return normalized.toUpperCase();
  }
  
  // Check if it's a full state name
  if (stateMap[normalized]) {
    return stateMap[normalized];
  }
  
  // Check if input contains a state (e.g., "Miami, FL" or "Miami, Florida")
  const parts = normalized.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    // Check if last part is state abbreviation
    if (/^[A-Z]{2}$/i.test(lastPart)) {
      return lastPart.toUpperCase();
    }
    // Check if last part is state name
    if (stateMap[lastPart]) {
      return stateMap[lastPart];
    }
  }
  
  // Try to find state name anywhere in the input
  for (const [stateName, stateCode] of Object.entries(stateMap)) {
    if (normalized.includes(stateName)) {
      return stateCode;
    }
  }
  
  return null;
}
