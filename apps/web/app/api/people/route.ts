import { NextRequest, NextResponse } from 'next/server';
import { API_KEYS, API_URLS } from '@/lib/api/config';

/**
 * GET /api/people
 * Fetches state legislators from OpenStates API
 * 
 * Query Parameters:
 * - state: State abbreviation (e.g., 'FL', 'CA')
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get('state');

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }

    // Check if OpenStates API key is configured
    const apiKey = API_KEYS.openStates;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenStates API key not configured' },
        { status: 500 }
      );
    }

    // Fetch from OpenStates API
    const url = `${API_URLS.openStates}/people?jurisdiction=${state}&apikey=${apiKey}`;
    
    console.log('Fetching state legislators from OpenStates:', state);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenStates API error:', response.status, errorText);
      
      return NextResponse.json(
        {
          error: 'Failed to fetch state legislators',
          details: `OpenStates API returned ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.results || [],
    });
  } catch (error) {
    console.error('Error in people API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch state legislators',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
