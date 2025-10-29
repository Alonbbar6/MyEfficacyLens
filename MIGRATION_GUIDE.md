# Migration Guide: Moving Projects to Monorepo

This guide will walk you through moving your existing `fenago21` (web) and `political-tracker-app` (mobile) projects into the new monorepo structure.

## 📋 Prerequisites

- [ ] Backup both projects
- [ ] Install pnpm: `npm install -g pnpm`
- [ ] Ensure Node.js 18+ is installed
- [ ] Close all running dev servers

## 🚀 Step-by-Step Migration

### Step 1: Move Web Project (fenago21)

```bash
# Navigate to the monorepo root
cd /Users/alonsobardales/Desktop/Political\ app/efficacy-monorepo

# Create apps/web directory
mkdir -p apps/web

# Copy fenago21 contents to apps/web
cp -r ../fenago21/* apps/web/
cp -r ../fenago21/.* apps/web/ 2>/dev/null || true

# Remove node_modules and build artifacts
rm -rf apps/web/node_modules
rm -rf apps/web/.next
rm -rf apps/web/package-lock.json
```

### Step 2: Move Mobile Project (political-tracker-app)

```bash
# Create apps/mobile directory
mkdir -p apps/mobile

# Copy political-tracker-app contents to apps/mobile
cp -r ../political-tracker-app/* apps/mobile/
cp -r ../political-tracker-app/.* apps/mobile/ 2>/dev/null || true

# Remove node_modules and build artifacts
rm -rf apps/mobile/node_modules
rm -rf apps/mobile/.expo
rm -rf apps/mobile/package-lock.json
```

### Step 3: Update Web App Configuration

#### 3.1 Update `apps/web/package.json`

Add workspace dependencies:

```json
{
  "name": "web",
  "dependencies": {
    "@efficacy/shared-types": "workspace:*",
    "@efficacy/shared-constants": "workspace:*",
    "@efficacy/shared-utils": "workspace:*",
    // ... keep all existing dependencies
  }
}
```

#### 3.2 Update `apps/web/tsconfig.json`

Add path aliases:

```json
{
  "compilerOptions": {
    // ... existing config
    "paths": {
      "@efficacy/shared-types": ["../../packages/shared-types/src"],
      "@efficacy/shared-constants": ["../../packages/shared-constants/src"],
      "@efficacy/shared-utils": ["../../packages/shared-utils/src"]
    }
  }
}
```

### Step 4: Update Mobile App Configuration

#### 4.1 Update `apps/mobile/package.json`

Add workspace dependencies:

```json
{
  "name": "mobile",
  "dependencies": {
    "@efficacy/shared-types": "workspace:*",
    "@efficacy/shared-constants": "workspace:*",
    "@efficacy/shared-utils": "workspace:*",
    // ... keep all existing dependencies
  }
}
```

#### 4.2 Update `apps/mobile/tsconfig.json`

Add path aliases:

```json
{
  "compilerOptions": {
    // ... existing config
    "paths": {
      "@efficacy/shared-types": ["../../packages/shared-types/src"],
      "@efficacy/shared-constants": ["../../packages/shared-constants/src"],
      "@efficacy/shared-utils": ["../../packages/shared-utils/src"]
    }
  }
}
```

### Step 5: Install Dependencies

```bash
# From monorepo root
pnpm install
```

This will install all dependencies for all packages and apps.

### Step 6: Test Both Apps

#### Test Web App

```bash
# From monorepo root
pnpm dev:web

# Or navigate to apps/web
cd apps/web
pnpm dev
```

Visit http://localhost:3000

#### Test Mobile App

```bash
# From monorepo root
pnpm dev:mobile

# Or navigate to apps/mobile
cd apps/mobile
pnpm start
```

### Step 7: Migrate Types to Shared Package

#### 7.1 Update Mobile App Types

Replace `apps/mobile/types/index.ts` imports with shared types:

**Before:**
```typescript
// apps/mobile/types/index.ts
export interface Politician {
  // ...
}
```

**After:**
```typescript
// apps/mobile/components/politician/PoliticianCard.tsx
import type { Politician } from '@efficacy/shared-types';
```

#### 7.2 Update Web App Types

If web app has similar types, replace them with shared types:

```typescript
// apps/web/components/PoliticianCard.tsx
import type { Politician } from '@efficacy/shared-types';
```

### Step 8: Migrate Constants

#### 8.1 Update Mobile App Constants

Replace `apps/mobile/constants/colors.ts` with shared constants:

**Before:**
```typescript
// apps/mobile/constants/colors.ts
export const Colors = { /* ... */ };
```

**After:**
```typescript
// apps/mobile/components/SomeComponent.tsx
import { Colors } from '@efficacy/shared-constants';
```

#### 8.2 Update Web App Constants

```typescript
// apps/web/components/SomeComponent.tsx
import { Colors, BRAND } from '@efficacy/shared-constants';
```

### Step 9: Environment Variables

#### 9.1 Create Root .env

```bash
# Copy from existing projects
cp ../political-tracker-app/.env .env
```

Edit `.env` to include variables from both projects:

```env
# Shared API Keys
GOOGLE_CIVIC_API_KEY=your_key
GOOGLE_MAPS_API_KEY=your_key
OPENSTATES_API_KEY=your_key

# Web-specific (NextAuth, MongoDB, Stripe)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Mobile-specific
EXPO_PUBLIC_API_URL=http://localhost:3000
```

#### 9.2 Create App-Specific .env Files

```bash
# Web app
cp apps/web/.env apps/web/.env.local

# Mobile app (already has .env)
# Just verify it exists
```

### Step 10: Update Import Paths

#### 10.1 Find and Replace in Mobile App

```bash
cd apps/mobile

# Replace local type imports with shared types
find . -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|from '\''\.\.\/types'\''|from '\''@efficacy/shared-types'\''|g'
find . -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|from '\''\.\.\/\.\.\/types'\''|from '\''@efficacy/shared-types'\''|g'

# Replace local constants with shared constants
find . -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|from '\''\.\.\/constants/colors'\''|from '\''@efficacy/shared-constants'\''|g'
```

### Step 11: Verify Everything Works

#### Checklist:

- [ ] Web app builds without errors: `pnpm --filter web build`
- [ ] Mobile app starts without errors: `pnpm --filter mobile start`
- [ ] Shared types are imported correctly
- [ ] Shared constants are imported correctly
- [ ] No TypeScript errors
- [ ] Hot reload works in both apps
- [ ] Environment variables are loaded correctly

### Step 12: Clean Up Old Projects (Optional)

Once everything works, you can archive the old projects:

```bash
cd /Users/alonsobardales/Desktop/Political\ app

# Create backup folder
mkdir _archived_projects

# Move old projects
mv fenago21 _archived_projects/
mv political-tracker-app _archived_projects/

# Add timestamp
mv _archived_projects _archived_projects_$(date +%Y%m%d)
```

## 🐛 Troubleshooting

### Issue: "Cannot find module '@efficacy/shared-types'"

**Solution:**
```bash
# Reinstall dependencies
pnpm install

# Clear cache
rm -rf node_modules
rm -rf apps/*/node_modules
pnpm install
```

### Issue: TypeScript errors in shared packages

**Solution:**
```bash
# Build shared packages
pnpm --filter "@efficacy/*" lint
```

### Issue: Web app can't find Next.js

**Solution:**
```bash
cd apps/web
pnpm install next react react-dom
```

### Issue: Mobile app can't start Expo

**Solution:**
```bash
cd apps/mobile
pnpm install expo expo-router
```

### Issue: Environment variables not loading

**Solution:**
- Verify `.env` file exists in monorepo root
- Verify app-specific `.env` files exist
- Restart dev servers
- Check variable names match (NEXT_PUBLIC_ for web, EXPO_PUBLIC_ for mobile)

## 📝 Post-Migration Tasks

### Update Git Repository

```bash
cd efficacy-monorepo

# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Initial monorepo setup with web and mobile apps"

# Add remote (if you have one)
git remote add origin your-repo-url
git push -u origin main
```

### Update Documentation

- [ ] Update README files in both apps
- [ ] Document shared package usage
- [ ] Update deployment documentation
- [ ] Create CONTRIBUTING.md

### Set Up CI/CD

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm --filter web build
      - run: pnpm --filter mobile build
```

## 🎉 Success!

Your monorepo is now set up! You can:

- Run both apps simultaneously: `pnpm dev`
- Share code between web and mobile
- Maintain consistent types and constants
- Deploy each app independently

## 📚 Next Steps

1. **Migrate more code to shared packages**
   - Move API client logic
   - Extract common utilities
   - Share validation functions

2. **Set up Turborepo** (optional)
   - Faster builds with caching
   - Parallel task execution

3. **Add Storybook** (optional)
   - Document shared components
   - Visual testing

4. **Set up E2E tests**
   - Test both apps together
   - Ensure API compatibility

---

**Need help?** Check the [MONOREPO_MERGE_PLAN.md](./MONOREPO_MERGE_PLAN.md) for more details.
