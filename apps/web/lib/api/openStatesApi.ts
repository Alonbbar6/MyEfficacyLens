export interface OpenStatesLegislator {
  id: string;
  name: string;
  party: string;
  image?: string;
  email?: string;
  capitol_voice?: string;
  district_voice?: string;
  capitol_address?: string;
  district_address?: string;
  current_role?: {
    title: string;
    district: number;
    chamber: string;
  };
}

export async function fetchLegislatorsByState(stateCode: string): Promise<OpenStatesLegislator[]> {
  const url = `/api/people?state=${stateCode.toUpperCase()}`;
  
  console.log('Fetching state legislators from API:', stateCode);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  
  const result = await response.json();
  return result.data || [];
}
