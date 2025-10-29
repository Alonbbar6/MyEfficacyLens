# Troubleshooting Guide

## ✅ Fixed Issues

### 1. TypeError: expected dynamic type 'boolean', but had type 'string'

**Problem:** The `TabBarIcon` component was using HTML `<span>` element instead of React Native components.

**Solution:** Changed from:
```tsx
<span style={{ fontSize: size, color }}>
```

To:
```tsx
import { Text } from 'react-native';

<Text style={{ fontSize: size, color }}>
```

**File:** `app/(tabs)/_layout.tsx`

---

### 2. "Too many screens defined" warnings

**Problem:** Detail routes (`politician/[id]`, `bill/[id]`, `event/[id]`) were being created inside the `(tabs)` folder, which caused routing conflicts.

**Solution:** Created detail routes at the root `app/` level:
- `app/politician/[id].tsx` ✅
- `app/bill/[id].tsx` ✅
- `app/event/[id].tsx` ✅

These are now properly configured in `app/_layout.tsx` as Stack screens.

---

## Common Issues & Solutions

### Issue: Metro bundler won't start

**Solution:**
```bash
# Clear cache and restart
npx expo start -c
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check types
npx tsc --noEmit
```

### Issue: Expo Go app won't connect

**Solutions:**
1. Make sure phone and computer are on same WiFi
2. Try scanning QR code again
3. Restart Expo Go app
4. Restart development server with `npm start`

### Issue: Location permissions not working

**Solution:**
- iOS: Check Settings > Privacy > Location Services
- Android: Check Settings > Apps > Permissions > Location

### Issue: API calls failing

**Check:**
1. `.env` file exists with correct API keys
2. API keys are prefixed with `EXPO_PUBLIC_`
3. Restart development server after adding `.env`

---

## Development Tips

### Clear Cache
```bash
npx expo start -c
```

### Reset Project
```bash
rm -rf node_modules
rm -rf .expo
npm install
npx expo start -c
```

### Check Logs
- iOS: `npx react-native log-ios`
- Android: `npx react-native log-android`

### Debug Menu
- iOS Simulator: `Cmd + D`
- Android Emulator: `Cmd + M`
- Physical Device: Shake device

---

## File Structure Issues

### Correct Structure
```
app/
├── (tabs)/              # Tab navigation group
│   ├── _layout.tsx     # Tab configuration
│   ├── index.tsx       # Home tab
│   ├── politicians.tsx # Politicians tab
│   ├── bills.tsx       # Bills tab
│   └── events.tsx      # Events tab
├── politician/         # Detail routes (NOT in tabs)
│   └── [id].tsx
├── bill/
│   └── [id].tsx
├── event/
│   └── [id].tsx
├── onboarding.tsx      # Standalone screen
└── _layout.tsx         # Root layout
```

### ❌ Wrong Structure
```
app/
├── (tabs)/
│   ├── politician/     # ❌ Don't put detail routes here
│   │   └── [id].tsx
```

---

## Performance Issues

### Slow Rendering
- Use `React.memo` for expensive components
- Implement `FlatList` virtualization
- Avoid inline function definitions in render

### Large Bundle Size
- Use dynamic imports
- Enable Hermes engine (default in Expo)
- Optimize images (use WebP)

---

## API Integration Issues

### Google Civic API
**Common errors:**
- Invalid API key → Check `.env` file
- Quota exceeded → Check Google Cloud Console
- Invalid address → Validate user input

**Test API:**
```bash
curl "https://www.googleapis.com/civicinfo/v2/representatives?address=10001&key=YOUR_API_KEY"
```

---

## Build Issues

### iOS Build Fails
```bash
cd ios
pod install
cd ..
npx expo run:ios
```

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

---

## Getting Help

1. Check [Expo Documentation](https://docs.expo.dev/)
2. Search [Expo Forums](https://forums.expo.dev/)
3. Check [React Native Docs](https://reactnative.dev/)
4. Review error logs carefully

---

**Last Updated:** October 27, 2025
