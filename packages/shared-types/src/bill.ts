/**
 * Shared Bill Types
 * Used by both web and mobile applications
 */

export type BillStatus = 'Introduced' | 'In Committee' | 'Passed House' | 'Passed Senate' | 'Enacted' | 'Vetoed' | 'Failed';
export type BillLevel = 'Federal' | 'State';

export interface Bill {
  id: string;
  title: string;
  number: string;
  status: BillStatus;
  level: BillLevel;
  introducedDate: string;
  lastActionDate?: string;
  summary?: string;
  fullText?: string;
  sponsor?: {
    name: string;
    party: string;
  };
  cosponsors?: Array<{
    name: string;
    party: string;
  }>;
  subjects?: string[];
  votes?: {
    yea: number;
    nay: number;
    present: number;
  };
}

export interface BillFilters {
  status?: BillStatus;
  level?: BillLevel;
  searchQuery?: string;
  subject?: string;
}
