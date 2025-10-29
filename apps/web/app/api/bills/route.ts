import { NextRequest, NextResponse } from 'next/server';
import { API_KEYS, API_URLS } from '@/lib/api/config';
import type {
  LegiScanSearchResponse,
  LegiScanMasterListResponse,
  LegiScanBillSummary,
  LegiScanMasterListItem,
} from '@/types/legiscan';
import { Bill } from '@efficacy/shared-types';
import { getStatusLabel } from '@/types/legiscan';

/**
 * GET /api/bills
 * Fetches bills from LegiScan API
 * 
 * Query Parameters:
 * - state: State abbreviation (default: 'FL')
 * - query: Search query string (optional)
 * - year: Year for session (default: current year)
 * - limit: Number of results to return (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state') || 'FL';
    const query = searchParams.get('query');
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validate API key
    const apiKey = API_KEYS.legiScan;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'LegiScan API key not configured' },
        { status: 500 }
      );
    }

    let bills: Bill[] = [];

    if (query) {
      // Use search endpoint if query is provided
      bills = await searchBills(apiKey, state, query, limit);
    } else {
      // Use master list endpoint for all bills
      bills = await getMasterList(apiKey, state, year, limit);
    }

    return NextResponse.json({
      success: true,
      data: bills,
      count: bills.length,
      state,
      query: query || null,
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bills',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Search bills using LegiScan search API
 */
async function searchBills(
  apiKey: string,
  state: string,
  query: string,
  limit: number
): Promise<Bill[]> {
  const url = `${API_URLS.legiScan}/?key=${apiKey}&op=getSearch&state=${state}&query=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`LegiScan API error: ${response.status} ${response.statusText}`);
  }

  const data: LegiScanSearchResponse = await response.json();

  if (data.status !== 'OK') {
    throw new Error('LegiScan API returned error status');
  }

  // Transform LegiScan search results to our Bill type
  const bills: Bill[] = data.searchresult
    .slice(0, limit)
    .map((item) => transformSearchResultToBill(item, state));

  return bills;
}

/**
 * Get master list of bills for a state/session
 */
async function getMasterList(
  apiKey: string,
  state: string,
  year: string,
  limit: number
): Promise<Bill[]> {
  // First, get the session ID for the state and year
  const sessionId = await getSessionId(apiKey, state, year);
  
  if (!sessionId) {
    throw new Error(`No active session found for ${state} in ${year}`);
  }

  const url = `${API_URLS.legiScan}/?key=${apiKey}&op=getMasterList&id=${sessionId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`LegiScan API error: ${response.status} ${response.statusText}`);
  }

  const data: LegiScanMasterListResponse = await response.json();

  if (data.status !== 'OK') {
    throw new Error('LegiScan API returned error status');
  }

  // Transform master list to array and limit results
  const billsArray = Object.values(data.masterlist)
    .slice(0, limit)
    .map((item) => transformMasterListToBill(item, state));

  return billsArray;
}

/**
 * Get session ID for a state and year
 */
async function getSessionId(
  apiKey: string,
  state: string,
  year: string
): Promise<number | null> {
  const url = `${API_URLS.legiScan}/?key=${apiKey}&op=getSessionList&state=${state}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to get session list: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== 'OK' || !data.sessions) {
    return null;
  }

  // Find the most recent session for the given year
  const sessions = Object.values(data.sessions) as any[];
  const targetYear = parseInt(year, 10);

  // Sort by year_start descending and find matching session
  const matchingSession = sessions
    .sort((a: any, b: any) => b.year_start - a.year_start)
    .find((session: any) => 
      session.year_start <= targetYear && session.year_end >= targetYear
    );

  return matchingSession ? matchingSession.session_id : null;
}

/**
 * Transform LegiScan search result to our Bill type
 */
function transformSearchResultToBill(item: any, state: string): Bill {
  return {
    id: item.bill_id.toString(),
    title: item.title || 'No title available',
    number: item.bill_number || 'Unknown',
    status: getStatusLabel(item.status) as any,
    level: 'State',
    introducedDate: item.last_action_date || new Date().toISOString(),
    lastActionDate: item.last_action_date,
    summary: item.last_action || 'No summary available',
    fullText: item.text_url || item.url,
  };
}

/**
 * Transform LegiScan master list item to our Bill type
 */
function transformMasterListToBill(item: LegiScanMasterListItem, state: string): Bill {
  return {
    id: item.bill_id.toString(),
    title: item.title || 'No title available',
    number: item.number || 'Unknown',
    status: getStatusLabel(item.status) as any,
    level: 'State',
    introducedDate: item.status_date || new Date().toISOString(),
    lastActionDate: item.last_action_date,
    summary: item.last_action || item.description || 'No summary available',
    fullText: item.url,
  };
}
