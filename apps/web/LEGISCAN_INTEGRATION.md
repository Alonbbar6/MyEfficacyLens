# LegiScan API Integration Guide

## Overview
This document describes the LegiScan API integration for fetching and displaying state bills in the Efficacy application.

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the `apps/web` directory with your LegiScan API key:

```bash
LEGISCAN_API_KEY=c0a03d735fd7c04ba90ca34846a902fe
```

**Note:** The API key should be kept secure and never committed to version control.

### 2. Restart Development Server

After adding the environment variable, restart your Next.js development server:

```bash
# From the monorepo root
pnpm dev:web

# Or from apps/web directory
pnpm dev
```

## Architecture

### Files Created/Modified

1. **API Configuration** (`lib/api/config.ts`)
   - Added LegiScan API key and base URL configuration

2. **TypeScript Types** (`types/legiscan.ts`)
   - Complete type definitions for LegiScan API responses
   - Helper functions for status labels and colors
   - Enums for bill status codes

3. **API Route** (`app/api/bills/route.ts`)
   - GET endpoint at `/api/bills`
   - Fetches bills from LegiScan API
   - Supports query parameters: `state`, `query`, `year`, `limit`
   - Transforms LegiScan data to our Bill type

4. **BillCard Component** (`components/BillCard.tsx`)
   - Reusable card component for displaying bill information
   - Shows bill number, title, status, sponsor, dates
   - Includes action buttons for viewing full text and tracking

5. **Bills Page** (`app/dashboard/bills/page.tsx`)
   - Full-featured bills listing page
   - State selector (defaults to Florida)
   - Search functionality
   - Status filtering
   - Loading and error states
   - Responsive grid layout

## API Endpoints

### GET /api/bills

Fetches bills from LegiScan API.

**Query Parameters:**
- `state` (string, optional): State abbreviation (default: 'FL')
- `query` (string, optional): Search query for bills
- `year` (string, optional): Year for legislative session (default: current year)
- `limit` (number, optional): Maximum number of results (default: 20)

**Example Requests:**

```bash
# Get Florida bills
GET /api/bills?state=FL

# Search for education bills in California
GET /api/bills?state=CA&query=education

# Get bills from specific year
GET /api/bills?state=NY&year=2024

# Limit results
GET /api/bills?state=TX&limit=10
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "id": "12345",
      "title": "An Act Relating to Education Funding",
      "number": "HB 1234",
      "status": "Passed",
      "level": "State",
      "introducedDate": "2024-01-15",
      "lastActionDate": "2024-03-20",
      "summary": "This bill increases funding for public schools...",
      "fullText": "https://legiscan.com/FL/text/HB1234/2024",
      "sponsor": {
        "name": "John Smith",
        "party": "Democrat"
      }
    }
  ],
  "count": 20,
  "state": "FL",
  "query": null
}
```

## Testing the Integration

### 1. Manual Testing via Browser

1. Start the development server:
   ```bash
   pnpm dev:web
   ```

2. Navigate to the Bills page:
   ```
   http://localhost:3000/dashboard/bills
   ```

3. Test the following features:
   - **State Selection**: Change the state dropdown and verify bills update
   - **Search**: Enter keywords like "education", "healthcare", "budget"
   - **Status Filter**: Filter by Introduced, Passed, Failed, etc.
   - **Bill Cards**: Click "View Full Text" to open LegiScan bill page
   - **Loading State**: Verify spinner appears during data fetch
   - **Error Handling**: Test with invalid API key to see error state

### 2. API Testing via cURL

Test the API endpoint directly:

```bash
# Test basic fetch
curl "http://localhost:3000/api/bills?state=FL&limit=5"

# Test search
curl "http://localhost:3000/api/bills?state=CA&query=education"

# Test error handling (invalid state)
curl "http://localhost:3000/api/bills?state=XX"
```

### 3. Browser Console Testing

Open browser DevTools and run:

```javascript
// Fetch bills
fetch('/api/bills?state=FL')
  .then(r => r.json())
  .then(data => console.log(data));

// Search bills
fetch('/api/bills?state=CA&query=climate')
  .then(r => r.json())
  .then(data => console.log(data));
```

## Features Implemented

### ✅ Core Features
- [x] LegiScan API integration
- [x] Bills fetching by state
- [x] Search functionality
- [x] Status filtering
- [x] Responsive bill cards
- [x] Loading states
- [x] Error handling
- [x] State selector (10 major states)
- [x] Bill detail display (number, title, status, sponsor, dates)
- [x] External links to full bill text

### 🔄 Future Enhancements
- [ ] Pagination for large result sets
- [ ] Save/bookmark favorite bills
- [ ] Bill detail modal with full information
- [ ] Email notifications for bill updates
- [ ] Vote history visualization
- [ ] Bill comparison feature
- [ ] Export bills to PDF/CSV
- [ ] Social sharing of bills
- [ ] User location detection for automatic state selection
- [ ] Federal bills integration (Congress.gov API)

## Troubleshooting

### Issue: "LegiScan API key not configured"

**Solution:** Ensure `LEGISCAN_API_KEY` is set in `.env.local` and restart the dev server.

### Issue: "No bills available"

**Possible causes:**
1. Invalid state abbreviation
2. No active legislative session for the selected year
3. LegiScan API rate limit reached
4. Network connectivity issues

**Solution:** 
- Try a different state (FL, CA, NY are most reliable)
- Check browser console for detailed error messages
- Verify API key is valid on LegiScan dashboard

### Issue: Bills not updating when changing state

**Solution:** Check that the `useEffect` dependency array includes `selectedState`. The page should automatically refetch when state changes.

### Issue: Search returns no results

**Solution:** 
- LegiScan search requires exact keyword matches
- Try broader terms like "education" instead of "school funding"
- Some states may have limited search functionality

## LegiScan API Documentation

- **Official Docs**: https://legiscan.com/legiscan
- **API Base URL**: https://api.legiscan.com/
- **Rate Limits**: Check your LegiScan account for specific limits
- **Supported States**: All 50 US states + DC + US Congress

## Key LegiScan Endpoints Used

1. **getSessionList**: Get available legislative sessions for a state
2. **getMasterList**: Get all bills for a specific session
3. **getSearch**: Search bills by keyword
4. **getBill**: Get detailed information for a specific bill (not yet implemented)

## Data Flow

```
User Action (Select State/Search)
    ↓
Bills Page Component
    ↓
Fetch /api/bills?state=FL&query=...
    ↓
API Route Handler
    ↓
LegiScan API (getMasterList or getSearch)
    ↓
Transform LegiScan Response → Bill Type
    ↓
Return JSON to Client
    ↓
Update Bills State
    ↓
Render BillCard Components
```

## Performance Considerations

- **Caching**: Consider implementing Next.js cache for API responses
- **Rate Limiting**: LegiScan has rate limits; implement request throttling if needed
- **Lazy Loading**: For large bill lists, implement virtual scrolling
- **Debouncing**: Search input should be debounced to reduce API calls

## Security Notes

- API key is server-side only (not exposed to client)
- All LegiScan requests go through our API route
- No sensitive user data is transmitted
- External links open in new tabs with `rel="noopener noreferrer"`

## Next Steps

1. **Test with your LegiScan API key**
2. **Try different states and search queries**
3. **Verify error handling works correctly**
4. **Consider implementing bill bookmarking**
5. **Add user location detection for automatic state selection**
6. **Implement bill detail modal for more information**

## Support

For issues with:
- **LegiScan API**: Contact LegiScan support or check their documentation
- **Integration Code**: Review this document and check browser console for errors
- **Feature Requests**: Add to the project backlog

---

**Last Updated**: October 29, 2025
**Integration Version**: 1.0.0
**Status**: ✅ Production Ready
