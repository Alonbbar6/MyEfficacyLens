# Efficacy Monorepo

A unified monorepo for the Efficacy Political Tracker platform, containing both web and mobile applications.

## 📁 Project Structure

```
efficacy-monorepo/
├── apps/
│   ├── web/          # Next.js web application (marketing + dashboard)
│   └── mobile/       # React Native/Expo mobile app
├── packages/
│   ├── shared-types/      # Shared TypeScript types
│   ├── shared-constants/  # Shared constants and configuration
│   ├── shared-utils/      # Shared utility functions
│   └── api-client/        # Shared API client
└── package.json           # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+ (install with `npm install -g pnpm`)

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

```bash
# Run both apps simultaneously
pnpm dev

# Run only web app (http://localhost:3000)
pnpm dev:web

# Run only mobile app
pnpm dev:mobile
```

### Building

```bash
# Build web app
pnpm build:web

# Build mobile app
pnpm build:mobile
```

## 📦 Apps

### Web (`apps/web`)
- **Framework**: Next.js 14
- **Purpose**: Marketing website, landing pages, admin dashboard
- **Tech**: React, NextAuth, MongoDB, Stripe, Tailwind CSS
- **URL**: http://localhost:3000

### Mobile (`apps/mobile`)
- **Framework**: Expo/React Native
- **Purpose**: User-facing mobile app for iOS and Android
- **Tech**: Expo Router, Zustand, React Query
- **Platform**: iOS, Android, Web

## 📚 Shared Packages

### @efficacy/shared-types
Platform-agnostic TypeScript types used by both web and mobile apps.

### @efficacy/shared-constants
Shared constants, colors, API URLs, and configuration values.

### @efficacy/shared-utils
Reusable utility functions for date formatting, string manipulation, etc.

### @efficacy/api-client
Shared API client logic for fetching politicians, bills, and events.

## 🔧 Adding Dependencies

```bash
# Add to web app
pnpm --filter web add package-name

# Add to mobile app
pnpm --filter mobile add package-name

# Add to a shared package
pnpm --filter @efficacy/shared-types add package-name
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Test specific app
pnpm --filter web test
pnpm --filter mobile test
```

## 📝 Environment Variables

Create `.env.local` files in each app directory:

- `apps/web/.env.local` - Web-specific environment variables
- `apps/mobile/.env` - Mobile-specific environment variables

See `.env.example` files in each app for required variables.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test both apps work correctly
4. Submit a pull request

## 📄 License

Private - All rights reserved

## 🔗 Links

- [Web App Documentation](./apps/web/README.md)
- [Mobile App Documentation](./apps/mobile/README.md)
- [Monorepo Merge Plan](../MONOREPO_MERGE_PLAN.md)
