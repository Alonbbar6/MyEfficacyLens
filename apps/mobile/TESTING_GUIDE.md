# Testing Guide - Politicians Feature

## 🎯 Quick Test Checklist

### ✅ Basic Functionality
- [ ] App loads without errors
- [ ] Politicians tab is accessible
- [ ] Politicians list displays
- [ ] Search bar is functional
- [ ] Filter buttons work (All, Federal, State, Local)
- [ ] Pull-to-refresh works
- [ ] Tap on politician card navigates to detail page

### ✅ Data Display
- [ ] Politician names display correctly
- [ ] Positions/titles show properly
- [ ] Party badges are color-coded (Blue=Democrat, Red=Republican, Purple=Independent, Gray=Other)
- [ ] Contact info (phone/email) displays when available
- [ ] Photos load or show initials as fallback

### ✅ Error Handling
- [ ] Loading indicator shows while fetching
- [ ] Error message displays if API fails
- [ ] Retry button works after error
- [ ] Empty state shows when no results

## 🧪 Step-by-Step Testing

### Test 1: Initial Load
1. Open the app (http://localhost:8081)
2. Navigate to "Politicians" tab
3. **Expected**: 
   - Loading indicator appears
   - After ~1-2 seconds, list of politicians loads
   - Politicians from Washington DC area display (default location)
   - Should see federal, state, and local officials

### Test 2: Search Functionality
1. In the search bar, type "senator"
2. **Expected**: List filters to show only senators
3. Clear search and type a specific name (e.g., "Biden")
4. **Expected**: List filters to matching politicians
5. Type gibberish (e.g., "zzzzz")
6. **Expected**: Empty state shows "No politicians found"

### Test 3: Filter Buttons
1. Tap "Federal" filter button
2. **Expected**: 
   - Button highlights in blue
   - List shows only federal officials (President, Senators, Representatives)
3. Tap "State" filter button
4. **Expected**: 
   - Button highlights
   - List shows only state officials (Governor, State Legislators)
5. Tap "Local" filter button
6. **Expected**: 
   - Button highlights
   - List shows only local officials (Mayor, City Council, etc.)
7. Tap "All" filter button
8. **Expected**: All politicians display again

### Test 4: Combined Search + Filter
1. Type "representative" in search
2. Select "Federal" filter
3. **Expected**: Only federal representatives show
4. Switch to "State" filter
5. **Expected**: Only state representatives show

### Test 5: Pull-to-Refresh
1. Scroll to top of list
2. Pull down to refresh
3. **Expected**: 
   - Refresh indicator appears
   - List reloads
   - Politicians display again

### Test 6: Politician Card Details
1. Look at a politician card
2. **Expected to see**:
   - Photo or initials avatar
   - Full name
   - Position/title
   - Party badge (colored circle with letter)
   - Phone number (if available)
   - Email (if available)

### Test 7: Navigation
1. Tap on any politician card
2. **Expected**: 
   - Navigates to politician detail page
   - Shows "Politician Details" with ID
   - "Coming Soon" message displays
3. Go back to politicians list
4. **Expected**: List is still there (not reloaded)

### Test 8: Error Handling
1. Turn off WiFi/internet
2. Pull to refresh
3. **Expected**: 
   - Error message displays
   - "Retry" button appears
4. Turn WiFi back on
5. Tap "Retry" button
6. **Expected**: Politicians load successfully

## 🔍 What to Look For

### Console Logs (Browser DevTools)
Open browser console (F12) and look for:
```
Fetching representatives for address: 20500
Found X offices and Y officials
Mapped Z politicians
```

### Network Requests
In Network tab, look for:
```
GET https://www.googleapis.com/civicinfo/v2/representatives?address=20500&key=...
Status: 200 OK
```

### Expected Data
You should see politicians like:
- **Federal**: President, Vice President, Senators, House Representatives
- **State**: Governor, Lieutenant Governor, State Senators, State Representatives
- **Local**: Mayor, City Council Members, County Officials

## 🐛 Troubleshooting

### Issue: "Failed to load politicians"
**Check**:
1. Browser console for error details
2. Network tab for failed API request
3. API key in `.env` file
4. Internet connection

**Solution**:
- Tap "Retry" button
- Check API_SETUP.md for configuration
- Verify API key is correct in `app.json`

### Issue: Empty list
**Check**:
1. Console logs for "Mapped 0 politicians"
2. API response in Network tab
3. Location being used (should default to DC)

**Solution**:
- Try different location in settings
- Check if API returned data
- Verify mapping logic in politicians.ts

### Issue: Images not loading
**Check**:
1. Console for image load errors
2. Photo URLs in API response

**Solution**:
- This is normal - many officials don't have photos
- Initials avatar should display as fallback
- No action needed

### Issue: Search not working
**Check**:
1. Type in search bar
2. Check if filteredPoliticians updates

**Solution**:
- Clear search and try again
- Check browser console for errors
- Verify search logic in politicians.tsx

## 📊 Performance Checks

### Load Time
- **Initial load**: Should be < 3 seconds
- **Search filtering**: Should be instant (< 100ms)
- **Filter switching**: Should be instant

### Memory Usage
- Check browser Task Manager
- Should not increase significantly with scrolling
- No memory leaks when navigating away and back

### Smooth Scrolling
- List should scroll smoothly
- No lag or stuttering
- Images should not cause jank

## ✅ Success Criteria

All of these should work:
- ✅ Politicians load from API
- ✅ Search filters the list
- ✅ Filter buttons work
- ✅ Pull-to-refresh reloads
- ✅ Cards display all information
- ✅ Navigation to detail page works
- ✅ Error handling works
- ✅ Loading states display
- ✅ Empty states display
- ✅ Dark mode works (if enabled)

## 📝 Test Results Template

```
Date: ___________
Tester: ___________
Device/Browser: ___________

✅ Initial Load: PASS / FAIL
✅ Search: PASS / FAIL
✅ Filters: PASS / FAIL
✅ Pull-to-Refresh: PASS / FAIL
✅ Navigation: PASS / FAIL
✅ Error Handling: PASS / FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

## 🚀 Next: Test It Now!

Your app is running at: **http://localhost:8081**

1. Open in browser or scan QR code
2. Go to Politicians tab
3. Follow the test steps above
4. Report any issues you find!

Good luck! 🎉
