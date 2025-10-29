// Core Types for Political Tracker App

export interface Politician {
  id: string;
  name: string;
  position: string;
  party: 'Democrat' | 'Republican' | 'Independent' | 'Other';
  level: 'Federal' | 'State' | 'Local';
  photo?: string;
  phone?: string;
  email?: string;
  officeAddress?: string;
  district?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  biography?: string;
  committees?: string[];
  votingRecordSummary?: string;
  isFollowing?: boolean;
}

export interface Bill {
  id: string;
  billNumber: string;
  title: string;
  summary: string;
  status: 'Introduced' | 'In Committee' | 'Passed' | 'Enacted' | 'Failed';
  category?: string;
  introducedDate: string;
  lastActionDate: string;
  sponsors?: Politician[];
  coSponsors?: Politician[];
  votingRecord?: VotingRecord[];
  isTracking?: boolean;
}

export interface VotingRecord {
  date: string;
  chamber: 'House' | 'Senate';
  result: 'Passed' | 'Failed';
  yesVotes: number;
  noVotes: number;
  abstain: number;
}

export interface PoliticalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'Town Hall' | 'Debate' | 'Hearing' | 'Rally' | 'Other';
  politicians?: Politician[];
  isReminded?: boolean;
}

export interface UserLocation {
  address?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  stateCode?: string; // Two-letter state code (e.g., "FL")
  county?: string;
  latitude?: number;
  longitude?: number;
  congressionalDistrict?: string;
  stateSenateDistrict?: string;
  stateHouseDistrict?: string;
  formattedAddress?: string;
}

export interface UserPreferences {
  location: UserLocation;
  followedPoliticians: string[];
  trackedBills: string[];
  remindedEvents: string[];
  notificationsEnabled: boolean;
  darkMode: boolean;
}
