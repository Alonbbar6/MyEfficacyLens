export interface CivicApiResponse {
  offices: Array<{
    name: string;
    divisionId: string;
    levels?: string[];
    roles?: string[];
    officialIndices: number[];
  }>;
  officials: Array<{
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
      city?: string;
      state?: string;
      zip?: string;
    }>;
  }>;
  divisions?: Record<string, any>;
}

export async function fetchRepresentatives(address: string): Promise<CivicApiResponse> {
  const url = `/api/representatives?address=${encodeURIComponent(address)}`;
  
  console.log('Fetching representatives from API:', address);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  
  const result = await response.json();
  return result.data;
}
