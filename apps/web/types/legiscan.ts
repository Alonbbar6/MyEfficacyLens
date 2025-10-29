/**
 * LegiScan API Response Types
 * Documentation: https://legiscan.com/legiscan
 */

// LegiScan Bill Status Codes
export enum LegiScanStatus {
  Introduced = 1,
  Engrossed = 2,
  Enrolled = 3,
  Passed = 4,
  Vetoed = 5,
  Failed = 6,
}

// Raw LegiScan API Response Types
export interface LegiScanBillSummary {
  bill_id: number;
  bill_number: string;
  title: string;
  description: string;
  state: string;
  state_id: number;
  status: number;
  status_date: string;
  last_action: string;
  last_action_date: string;
  url: string;
  text_url?: string;
  research_url?: string;
  state_link?: string;
  change_hash: string;
  relevance?: number;
}

export interface LegiScanSponsor {
  people_id: number;
  person_hash: string;
  party_id: number;
  party: string;
  role_id: number;
  role: string;
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  nickname: string;
  district: string;
  sponsor_type_id: number;
  sponsor_order: number;
}

export interface LegiScanBillDetail {
  bill_id: number;
  change_hash: string;
  session_id: number;
  session: {
    session_id: number;
    state_id: number;
    year_start: number;
    year_end: number;
    special: number;
    session_name: string;
    name: string;
  };
  url: string;
  state_link: string;
  completed: number;
  status: number;
  status_date: string;
  progress: Array<{
    date: string;
    event: number;
  }>;
  state: string;
  state_id: number;
  bill_number: string;
  bill_type: string;
  bill_type_id: string;
  body: string;
  body_id: number;
  current_body: string;
  current_body_id: number;
  title: string;
  description: string;
  committee?: {
    committee_id: number;
    chamber: string;
    chamber_id: number;
    name: string;
  };
  pending_committee_id?: number;
  history: Array<{
    date: string;
    action: string;
    chamber: string;
    chamber_id: number;
    importance: number;
  }>;
  sponsors: LegiScanSponsor[];
  sasts?: any[];
  subjects?: Array<{
    subject_id: number;
    subject_name: string;
  }>;
  texts?: Array<{
    doc_id: number;
    date: string;
    type: string;
    type_id: number;
    mime: string;
    mime_id: number;
    url: string;
    state_link: string;
    text_size: number;
  }>;
  votes?: Array<{
    roll_call_id: number;
    date: string;
    desc: string;
    yea: number;
    nay: number;
    nv: number;
    absent: number;
    total: number;
    passed: number;
    chamber: string;
    chamber_id: number;
    url: string;
    state_link: string;
  }>;
  amendments?: any[];
  supplements?: any[];
  calendar?: any[];
}

export interface LegiScanSearchResult {
  relevance: number;
  state: string;
  bill_number: string;
  bill_id: number;
  change_hash: string;
  url: string;
  text_url: string;
  research_url: string;
  last_action_date: string;
  last_action: string;
  title: string;
}

export interface LegiScanMasterListItem {
  bill_id: number;
  number: string;
  change_hash: string;
  url: string;
  status_date: string;
  status: number;
  last_action_date: string;
  last_action: string;
  title: string;
  description: string;
}

// API Response Wrappers
export interface LegiScanResponse<T> {
  status: string;
  [key: string]: T | string;
}

export interface LegiScanSearchResponse {
  status: string;
  searchresult: LegiScanSearchResult[];
}

export interface LegiScanMasterListResponse {
  status: string;
  masterlist: {
    [key: string]: LegiScanMasterListItem;
  };
}

export interface LegiScanBillResponse {
  status: string;
  bill: LegiScanBillDetail;
}

// Helper function to map LegiScan status to readable string
export function getStatusLabel(status: number): string {
  switch (status) {
    case LegiScanStatus.Introduced:
      return 'Introduced';
    case LegiScanStatus.Engrossed:
      return 'Engrossed';
    case LegiScanStatus.Enrolled:
      return 'Enrolled';
    case LegiScanStatus.Passed:
      return 'Passed';
    case LegiScanStatus.Vetoed:
      return 'Vetoed';
    case LegiScanStatus.Failed:
      return 'Failed';
    default:
      return 'Unknown';
  }
}

// Helper function to get status badge color
export function getStatusColor(status: number): string {
  switch (status) {
    case LegiScanStatus.Introduced:
      return 'badge-info';
    case LegiScanStatus.Engrossed:
      return 'badge-primary';
    case LegiScanStatus.Enrolled:
      return 'badge-secondary';
    case LegiScanStatus.Passed:
      return 'badge-success';
    case LegiScanStatus.Vetoed:
      return 'badge-error';
    case LegiScanStatus.Failed:
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
}
