# Quick Start: Efficacy Monorepo

## 🎯 What Is This?

This is a **monorepo** that combines your two projects:
- **fenago21** (Next.js web app) → `apps/web`
- **political-tracker-app** (React Native mobile app) → `apps/mobile`

Both apps can now share code through common packages!

## 🚀 Quick Migration (5 Minutes)

### Option A: Automated Migration (Recommended)

```bash
# Navigate to the monorepo
cd /Users/alonsobardales/Desktop/Political\ app/efficacy-monorepo

# Make the script executable
chmod +x migrate.sh

# Run the migration
./migrate.sh
```

The script will:
- ✅ Copy both projects into the monorepo
- ✅ Update package.json files
- ✅ Install all dependencies
- ✅ Set up environment variables

### Option B: Manual Migration

Follow the detailed [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

## 📦 After Migration

### Run Both Apps

```bash
# Run both simultaneously
pnpm dev

# Or run individually:
pnpm dev:web      # Web app on http://localhost:3000
pnpm dev:mobile   # Mobile app with Expo
```

### Project Structure

```
efficacy-monorepo/
├── apps/
│   ├── web/           # Your fenago21 project
│   └── mobile/        # Your political-tracker-app
├── packages/
│   ├── shared-types/       # Shared TypeScript types
│   ├── shared-constants/   # Shared colors, URLs, etc.
│   └── shared-utils/       # Shared utility functions
└── package.json            # Root workspace config
```

## 🎨 Using Shared Packages

### In Mobile App

```typescript
// Before
import { Politician } from '../types';
import { Colors } from '../constants/colors';

// After
import type { Politician } from '@efficacy/shared-types';
import { Colors } from '@efficacy/shared-constants';
```

### In Web App

```typescript
// Import shared types and constants
import type { Politician, Bill } from '@efficacy/shared-types';
import { Colors, BRAND } from '@efficacy/shared-constants';
import { formatDate, truncate } from '@efficacy/shared-utils';
```

## 🔧 Common Commands

```bash
# Install dependencies
pnpm install

# Run web app
pnpm dev:web

# Run mobile app
pnpm dev:mobile

# Build web app
pnpm build:web

# Add dependency to web app
pnpm --filter web add package-name

# Add dependency to mobile app
pnpm --filter mobile add package-name

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean
```

## 📚 Shared Packages

### @efficacy/shared-types

Platform-agnostic TypeScript types:
- `Politician` - Politician data structure
- `Bill` - Bill/legislation data
- `Event` - Political events
- `User` - User and preferences

### @efficacy/shared-constants

Shared configuration:
- `Colors` - Light/dark theme colors
- `PartyColors` - Political party colors
- `API_URLS` - API endpoint URLs
- `BRAND` - Brand information

### @efficacy/shared-utils

Utility functions:
- `formatDate()` - Date formatting
- `truncate()` - String truncation
- `formatPhoneNumber()` - Phone formatting
- `isValidEmail()` - Email validation

## 🐛 Troubleshooting

### "Cannot find module '@efficacy/shared-types'"

```bash
pnpm install
```

### Web app won't start

```bash
cd apps/web
pnpm install
pnpm dev
```

### Mobile app won't start

```bash
cd apps/mobile
pnpm install
pnpm start
```

### TypeScript errors

```bash
# Rebuild shared packages
pnpm --filter "@efficacy/*" lint
```

## ✅ Verification Checklist

After migration, verify:

- [ ] Web app runs: `pnpm dev:web`
- [ ] Mobile app runs: `pnpm dev:mobile`
- [ ] No TypeScript errors
- [ ] Hot reload works in both apps
- [ ] Environment variables load correctly
- [ ] Can import from shared packages

## 📖 Next Steps

1. **Test both apps** - Make sure everything works
2. **Update imports** - Replace local imports with shared packages
3. **Migrate more code** - Move common code to shared packages
4. **Set up CI/CD** - Automate testing and deployment

## 📚 Documentation

- [MONOREPO_MERGE_PLAN.md](./MONOREPO_MERGE_PLAN.md) - Detailed merge strategy
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Step-by-step migration
- [README.md](./README.md) - General documentation

## 🆘 Need Help?

1. Check the [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) troubleshooting section
2. Review the [MONOREPO_MERGE_PLAN.md](./MONOREPO_MERGE_PLAN.md) for architecture details
3. Ensure pnpm is installed: `npm install -g pnpm`

---

**Ready to migrate?** Run `./migrate.sh` to get started!
