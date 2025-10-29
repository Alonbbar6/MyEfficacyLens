import { API_KEYS, API_URLS } from './config';
import { fetchRepresentatives } from './civicApi';
import { fetchLegislatorsByState, OpenStatesLegislator } from './openStatesApi';
import { Politician } from '../../types';

export const politiciansApi = {
  // Get representatives by address
  getRepresentativesByAddress: async (address: string): Promise<Politician[]> => {
    try {
      console.log('Fetching representatives for address:', address);
      
      // Try to extract state from address for OpenStates fallback
      const stateMatch = address.match(/\b([A-Z]{2})\b/);
      const zipMatch = address.match(/\b(\d{5})\b/);
      
      // Determine state from zip code or address
      let state = stateMatch ? stateMatch[1] : null;
      if (!state && zipMatch) {
        state = getStateFromZip(zipMatch[1]);
      }
      
      let politicians: Politician[] = [];
      
      // Try Google Civic API first (for federal officials)
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
        console.warn('Google Civic API failed, will use OpenStates for state legislators:', civicError.message);
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
        throw new Error('No politicians found. Please check your location or try a different address.');
      }
      
      return politicians;
    } catch (error: any) {
      console.error('Error fetching representatives:', error);
      console.error('Error details:', error.message);
      throw new Error(`Failed to fetch representatives: ${error.message}`);
    }
  },

  // Search politicians by name
  searchPoliticians: async (query: string, level?: string): Promise<Politician[]> => {
    // This would integrate with a real API
    // For now, returning mock data
    return mockPoliticians.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) &&
      (!level || p.level === level)
    );
  },

  // Get politician details
  getPoliticianById: async (id: string): Promise<Politician | null> => {
    // This would fetch from a real API
    return mockPoliticians.find(p => p.id === id) || null;
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
  
  // Add more state mappings as needed
  return null;
}

// Mock data for development
const mockPoliticians: Politician[] = [
  {
    id: '1',
    name: 'Alexandria Ocasio-Cortez',
    position: 'U.S. Representative, NY-14',
    party: 'Democrat',
    level: 'Federal',
    district: 'NY-14',
    biography: 'Representative for New York\'s 14th congressional district.',
    committees: ['Financial Services', 'Oversight and Reform'],
    votingRecordSummary: 'Progressive voting record on climate, healthcare, and economic justice.',
  },
  {
    id: '2',
    name: 'Ted Cruz',
    position: 'U.S. Senator, Texas',
    party: 'Republican',
    level: 'Federal',
    biography: 'Senior United States Senator from Texas.',
    committees: ['Judiciary', 'Commerce, Science, and Transportation'],
    votingRecordSummary: 'Conservative voting record on immigration, healthcare, and taxation.',
  },
];
