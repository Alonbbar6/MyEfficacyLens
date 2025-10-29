# Efficacy - Political Tracker Mobile App

A React Native + Expo mobile app that helps users search for local politicians, track political events, and monitor bills in their area.

## 🎯 Project Overview

Efficacy transforms political anxiety into action by providing clear, actionable, non-partisan information. Built for Gen Z users who feel politically paralyzed, this app makes civic engagement accessible and frictionless.

## 🚀 Tech Stack

- **React Native** with **Expo** (SDK 54)
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **React Query** (@tanstack/react-query) for API state management
- **Zustand** for global state management
- **AsyncStorage** for local data persistence
- **Expo Location** for geolocation
- **Expo Notifications** for push notifications

## 📁 Project Structure

```
political-tracker-app/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Home/Dashboard
│   │   ├── politicians.tsx      # Politicians directory
│   │   ├── bills.tsx            # Bills tracker
│   │   └── events.tsx           # Events calendar
│   ├── politician/[id].tsx      # Politician detail page
│   ├── bill/[id].tsx            # Bill detail page
│   ├── event/[id].tsx           # Event detail page
│   ├── onboarding.tsx           # Location setup
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── politician/              # Politician-specific components
│   ├── bill/                    # Bill-specific components
│   ├── event/                   # Event-specific components
│   └── common/                  # Shared components
├── services/                     # API services
│   └── api/
│       ├── config.ts            # API configuration
│       ├── politicians.ts       # Politicians API
│       ├── bills.ts             # Bills API (to be implemented)
│       └── events.ts            # Events API (to be implemented)
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
│   └── userStore.ts             # User preferences & state
├── utils/                        # Utility functions
├── constants/                    # App constants
│   └── colors.ts                # Efficacy brand colors
└── types/                        # TypeScript type definitions
    └── index.ts                 # Core types
```

## 🎨 Brand Identity

### Colors (Efficacy Brand)
- **Abyss** (#001F3F) - Deep anxiety/background
- **Clarity** (#0074D9) - Focus/CTAs
- **Efficacy** (#2ECC40) - Success/action
- **Momentum** (#11A377) - Progress

### Design Principles
- Clean, modern, accessible design
- Mobile-first approach
- Dark mode support
- Frictionless user experience
- Non-partisan, fact-based presentation

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_GOOGLE_CIVIC_API=your_google_civic_api_key
EXPO_PUBLIC_GOOGLE_MAPS_API=your_google_maps_api_key
```

### API Keys Required
- **Google Civic Information API** - For representative lookup
- **Google Maps API** - For geocoding (optional)

## 📱 Core Features

### 1. Location Setup
- ✅ Auto-detect location with Expo Location
- ✅ Manual entry (zip code or city/state)
- ✅ Local storage of preferences
- ⏳ Change location in settings

### 2. Politician Search & Directory
- ✅ Search politicians by name
- ✅ Filter by level (Federal, State, Local)
- ✅ Display politician cards with contact info
- ⏳ Detailed politician profile pages
- ⏳ "Follow" functionality

### 3. Bills & Legislation Tracker
- ⏳ List recent bills by location
- ⏳ Filter by status and topic
- ⏳ Plain-language bill summaries
- ⏳ Track bills with notifications

### 4. Political Events Calendar
- ⏳ Upcoming events (town halls, debates)
- ⏳ Calendar and list views
- ⏳ Add to device calendar
- ⏳ Event reminders

### 5. User Features
- ✅ Following list for politicians
- ✅ Watching list for bills
- ✅ Notification preferences
- ⏳ Saved searches
- ⏳ Share functionality

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Expo Go app on your phone (for testing)
- iOS Simulator or Android Emulator (optional)

### Install Dependencies

```bash
cd political-tracker-app
npm install
```

### Start Development Server

```bash
npm start
```

This will open Expo Dev Tools. You can then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan QR code with Expo Go app on your phone

### Run on Specific Platform

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📊 State Management

### User Store (Zustand)
Manages user preferences and tracked items:
- Location data
- Followed politicians
- Tracked bills
- Reminded events
- Notification settings
- Dark mode preference

### API State (React Query)
Handles all API calls with:
- Automatic caching
- Background refetching
- Retry logic
- Loading/error states

## 🔌 API Integration

### Google Civic Information API
Used for:
- Finding representatives by address
- Getting politician contact information
- District/constituency data

### Future Integrations
- **Congress.gov API** - Federal legislation
- **ProPublica Congress API** - Voting records
- **OpenStates API** - State legislation
- **Ballotpedia API** - Candidate information

## 🎯 Implementation Roadmap

### Phase 1: Core Setup ✅
- [x] Project initialization
- [x] Expo Router configuration
- [x] Type definitions
- [x] State management setup
- [x] Brand colors and constants
- [x] Onboarding flow
- [x] Home dashboard

### Phase 2: Politicians Feature ⏳
- [ ] Politicians list screen
- [ ] Politician search
- [ ] Politician detail page
- [ ] Follow/unfollow functionality
- [ ] Contact actions (call, email)

### Phase 3: Bills Feature ⏳
- [ ] Bills list screen
- [ ] Bill filtering
- [ ] Bill detail page
- [ ] Track/untrack functionality
- [ ] Bill status notifications

### Phase 4: Events Feature ⏳
- [ ] Events list screen
- [ ] Calendar view
- [ ] Event detail page
- [ ] Add to calendar
- [ ] Event reminders

### Phase 5: Polish & Optimization ⏳
- [ ] Dark mode implementation
- [ ] Push notifications
- [ ] Offline support
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Analytics integration

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npx tsc --noEmit
```

## 📦 Building for Production

### iOS

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios
```

### Android

```bash
# Build for Android
eas build --platform android
```

## 🤝 Contributing

This is a personal project for the Efficacy political tracker app. For questions or suggestions, please contact the development team.

## 📄 License

Private - All rights reserved

## 🔗 Related Projects

- **Efficacy Web App** - Next.js landing page (in `fenago21` directory)
- **Brand Identity** - Complete design system documentation

## 📞 Support

For technical issues or questions:
- Email: support@efficacy-app.com
- Documentation: See `/Political app/README.md`

---

**Built with ❤️ for Gen Z political activists**

*Stop Doomscrolling. Start Doing.*
