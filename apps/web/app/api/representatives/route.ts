import { NextRequest, NextResponse } from 'next/server';
import { API_KEYS, API_URLS } from '@/lib/api/config';

/**
 * GET /api/representatives
 * Fetches representatives from Google Civic API
 * 
 * Query Parameters:
 * - address: Address, city, state, or zip code
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Check if Google Civic API key is configured
    const apiKey = API_KEYS.googleCivic;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Civic API key not configured' },
        { status: 500 }
      );
    }

    // Fetch from Google Civic API
    // Note: Google Civic API requires specific addresses (zip codes, full addresses)
    // State names alone won't work
    // Using the correct endpoint: representativeInfoByAddress
    const url = `https://www.googleapis.com/civicinfo/v2/representativeInfoByAddress?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    console.log('Fetching from Google Civic API:', url.replace(apiKey, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Civic API error:', response.status, errorText);
      
      return NextResponse.json(
        {
          error: 'Failed to fetch representatives',
          details: `Google Civic API returned ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in representatives API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch representatives',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
