# Google Civic Information API Setup

## ✅ API Connection Status

Your Google Civic Information API is now **fully connected** to your efficacy application!

## 🔑 API Configuration

### Environment Variables
The API key is stored in `.env`:
```
EXPO_PUBLIC_GOOGLE_CIVIC_API=AIzaSyD9rzLJCUqRSCi9mKpo0fxZ1ACxffe5mzc
```

### App Configuration
The API key is also configured in `app.json` under the `extra` field:
```json
{
  "expo": {
    "extra": {
      "googleCivicApi": "AIzaSyD9rzLJCUqRSCi9mKpo0fxZ1ACxffe5mzc"
    }
  }
}
```

## 📁 File Structure

### API Service Files
- **`services/api/config.ts`**: Main API configuration with keys and base URLs
- **`services/api/civicApi.ts`**: Civic API service with helper functions

### Test Screens
- **`app/test-api.tsx`**: Main API test screen (tests both elections and representatives)
- **`app/test-civic.tsx`**: Elections endpoint test
- **`app/test-representatives.tsx`**: Representatives endpoint test
- **`app/(tabs)/test.tsx`**: Test dashboard (accessible from the app's bottom navigation)

## 🚀 How to Use the API in Your App

### 1. Import the Service
```typescript
import { fetchElections, fetchRepresentatives } from '../services/api/civicApi';
```

### 2. Fetch Elections
```typescript
const electionsData = await fetchElections();
console.log(electionsData.elections);
```

### 3. Fetch Representatives
```typescript
const address = '1600 Pennsylvania Ave NW, Washington, DC 20500';
const repsData = await fetchRepresentatives(address);
console.log(repsData.officials);
```

### 4. Fetch Representatives by Level
```typescript
// Get only federal representatives
const federalReps = await fetchRepresentatives(
  address,
  ['country'], // levels
  ['legislatorUpperBody', 'legislatorLowerBody'] // roles
);
```

## 🧪 Testing the API

### Method 1: Using the App
1. Open your app
2. Navigate to the "API Tests" tab (bottom navigation)
3. Tap on "Civic API Test" or "Representatives Test"
4. View the results

### Method 2: Using the Terminal
```bash
# Test elections endpoint
curl "https://www.googleapis.com/civicinfo/v2/elections?key=AIzaSyD9rzLJCUqRSCi9mKpo0fxZ1ACxffe5mzc"

# Test representatives endpoint
curl "https://www.googleapis.com/civicinfo/v2/representatives?address=1600%20Pennsylvania%20Ave%20NW%2C%20Washington%2C%20DC%2020500&key=AIzaSyD9rzLJCUqRSCi9mKpo0fxZ1ACxffe5mzc"
```

## 📚 Available API Functions

### `fetchElections()`
Fetches all available elections.

**Returns:**
```typescript
{
  kind: string;
  elections: Election[];
}
```

### `fetchRepresentatives(address, levels?, roles?)`
Fetches representatives for a given address.

**Parameters:**
- `address` (string): Full address
- `levels` (string[], optional): Government levels (e.g., ['country', 'administrativeArea1'])
- `roles` (string[], optional): Roles (e.g., ['legislatorUpperBody', 'legislatorLowerBody'])

**Returns:**
```typescript
{
  normalizedInput?: {...};
  offices: Office[];
  officials: Official[];
}
```

### `fetchVoterInfo(address, electionId?)`
Fetches voter information for a specific election and address.

### Helper Functions
- `getOfficialsByOffice(data, officeName)`: Get officials by office name
- `getFederalRepresentatives(data)`: Get all federal representatives
- `getStateRepresentatives(data)`: Get all state representatives
- `getLocalRepresentatives(data)`: Get all local representatives

## 🔧 Troubleshooting

### If the API is not working:
1. **Check API Key**: Ensure the key is correctly set in `.env` and `app.json`
2. **Restart the App**: After changing `.env`, restart the Expo development server
3. **Check Google Cloud Console**: Ensure the API is enabled
4. **Check API Restrictions**: Ensure your API key has the correct restrictions

### Common Errors:
- **404 Method not found**: The endpoint might not be available or the URL is incorrect
- **403 Forbidden**: API key restrictions might be blocking the request
- **400 Bad Request**: Check the parameters being sent

## 📝 Next Steps

Now that the API is connected, you can:
1. Create a screen to display representatives for the user's location
2. Show upcoming elections
3. Display voter information
4. Build a politician tracking feature
5. Integrate with your existing politician and bills features

## 🔒 Security Notes

⚠️ **Important**: The API key is currently stored in plain text in `app.json`. For production:
1. Use environment variables only (`.env`)
2. Never commit API keys to version control
3. Add `.env` to `.gitignore`
4. Consider using a backend service to proxy API requests
5. Implement API key rotation

## ✅ Verification

To verify the API is working, run your app and:
1. Go to "API Tests" tab
2. Tap "Test Civic API"
3. You should see:
   - ✓ Civic API Connected Successfully
   - Number of elections found
   - Number of representatives found
   - Latest election details

**Status**: 🟢 API is connected and working!
