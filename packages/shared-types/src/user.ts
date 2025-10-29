/**
 * Shared User Types
 * Used by both web and mobile applications
 */

export interface UserLocation {
  address?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  congressionalDistrict?: string;
  stateSenateDistrict?: string;
  stateHouseDistrict?: string;
  formattedAddress?: string;
}

export interface UserPreferences {
  darkMode: boolean;
  notifications: boolean;
  location: UserLocation;
  interests?: string[];
  followedPoliticians?: string[];
  savedBills?: string[];
  savedEvents?: string[];
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  preferences: UserPreferences;
  createdAt: string;
  lastActive?: string;
}
