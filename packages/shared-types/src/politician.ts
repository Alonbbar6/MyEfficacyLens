/**
 * Shared Politician Types
 * Used by both web and mobile applications
 */

export type PoliticalParty = 'Democrat' | 'Republican' | 'Independent' | 'Other';
export type PoliticalLevel = 'Federal' | 'State' | 'Local';

export interface Politician {
  id: string;
  name: string;
  position: string;
  party: PoliticalParty;
  level: PoliticalLevel;
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

export interface PoliticianFilters {
  level?: PoliticalLevel;
  party?: PoliticalParty;
  searchQuery?: string;
}
