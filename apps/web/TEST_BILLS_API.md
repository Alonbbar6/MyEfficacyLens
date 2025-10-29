# Quick Test Guide for Bills API

## Prerequisites
1. Create `.env.local` file with your LegiScan API key
2. Restart the dev server

## Manual Testing Steps

### 1. Test via Browser

Navigate to: **http://localhost:3000/dashboard/bills**

You should see:
- ✅ Loading spinner initially
- ✅ Bills grid with Florida bills (default state)
- ✅ State selector dropdown
- ✅ Search input and filters
- ✅ Bill cards with information

### 2. Test State Selection

1. Click the **State** dropdown
2. Select **California** or **New York**
3. Bills should reload automatically
4. Verify new bills appear for the selected state

### 3. Test Search Functionality

1. Enter a search term like **"education"** or **"healthcare"**
2. Click **Search** button
3. Results should filter to matching bills
4. Try **Clear** button to reset

### 4. Test Status Filter

1. Select different status options:
   - All Status
   - Introduced
   - Passed
   - Failed
2. Bills should filter accordingly

### 5. Test Bill Card Actions

1. Click **View Full Text** on any bill
2. Should open LegiScan page in new tab
3. **Track Bill** button (placeholder for future feature)

## API Testing via cURL

Open a terminal and run:

```bash
# Test 1: Get Florida bills
curl "http://localhost:3000/api/bills?state=FL&limit=5" | jq

# Test 2: Search California bills
curl "http://localhost:3000/api/bills?state=CA&query=education&limit=5" | jq

# Test 3: Get New York bills
curl "http://localhost:3000/api/bills?state=NY&limit=5" | jq

# Test 4: Test error handling (invalid state)
curl "http://localhost:3000/api/bills?state=INVALID" | jq
```

**Note:** Install `jq` for pretty JSON output: `brew install jq`

## Browser Console Testing

Open DevTools Console (F12) and run:

```javascript
// Test 1: Basic fetch
fetch('/api/bills?state=FL&limit=5')
  .then(r => r.json())
  .then(data => {
    console.log('Success:', data.success);
    console.log('Bill count:', data.count);
    console.log('First bill:', data.data[0]);
  });

// Test 2: Search
fetch('/api/bills?state=CA&query=climate')
  .then(r => r.json())
  .then(data => console.table(data.data));

// Test 3: Error handling
fetch('/api/bills?state=XX')
  .then(r => r.json())
  .then(data => console.log('Error response:', data));
```

## Expected Results

### Successful Response
```json
{
  "success": true,
  "data": [
    {
      "id": "123456",
      "title": "An Act relating to education funding",
      "number": "HB 1234",
      "status": "Passed",
      "level": "State",
      "introducedDate": "2024-01-15",
      "lastActionDate": "2024-03-20",
      "summary": "This bill increases funding...",
      "fullText": "https://legiscan.com/..."
    }
  ],
  "count": 5,
  "state": "FL",
  "query": null
}
```

### Error Response
```json
{
  "success": false,
  "error": "Failed to fetch bills",
  "details": "LegiScan API error: ..."
}
```

## Troubleshooting

### ❌ "LegiScan API key not configured"
**Fix:** Create `.env.local` with `LEGISCAN_API_KEY=your_key_here` and restart server

### ❌ "No bills available"
**Try:**
- Different state (FL, CA, NY are most reliable)
- Remove search query
- Check browser console for errors

### ❌ Bills not loading
**Check:**
1. Dev server is running: `http://localhost:3000`
2. No console errors in browser DevTools
3. API key is correct in `.env.local`
4. Network tab shows `/api/bills` request

### ❌ TypeScript errors
**Fix:** Run `pnpm install` in the monorepo root to ensure all dependencies are installed

## Success Checklist

- [ ] `.env.local` file created with API key
- [ ] Dev server restarted
- [ ] Bills page loads at `/dashboard/bills`
- [ ] Bills display for Florida (default)
- [ ] State selector works
- [ ] Search functionality works
- [ ] Status filter works
- [ ] Bill cards display correctly
- [ ] "View Full Text" opens LegiScan page
- [ ] Loading state appears during fetch
- [ ] Error state shows if API fails

## Next Steps After Testing

1. ✅ Verify all features work
2. 🎨 Customize styling if needed
3. 📱 Test responsive design on mobile
4. 🔧 Add bill bookmarking feature
5. 📊 Add bill detail modal
6. 🔔 Implement bill update notifications
7. 🗺️ Add user location detection for auto state selection

---

**Need Help?** Check `LEGISCAN_INTEGRATION.md` for detailed documentation.
