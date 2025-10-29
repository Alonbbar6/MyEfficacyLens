/**
 * Shared Event Types
 * Used by both web and mobile applications
 */

export type EventType = 'Town Hall' | 'Debate' | 'Rally' | 'Fundraiser' | 'Meeting' | 'Other';
export type EventLevel = 'Federal' | 'State' | 'Local';

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  level: EventLevel;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  };
  organizer?: {
    name: string;
    type: 'Politician' | 'Organization' | 'Other';
  };
  registrationUrl?: string;
  isVirtual?: boolean;
  virtualUrl?: string;
}

export interface EventFilters {
  type?: EventType;
  level?: EventLevel;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}
