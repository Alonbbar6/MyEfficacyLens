#!/bin/bash

# Efficacy Monorepo Migration Script
# This script automates the migration of fenago21 and political-tracker-app into the monorepo

set -e  # Exit on error

echo "🚀 Efficacy Monorepo Migration Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📁 Monorepo location: $SCRIPT_DIR"
echo "📁 Parent directory: $PARENT_DIR"
echo ""

# Check if source projects exist
if [ ! -d "$PARENT_DIR/fenago21" ]; then
    echo -e "${RED}❌ Error: fenago21 directory not found at $PARENT_DIR/fenago21${NC}"
    exit 1
fi

if [ ! -d "$PARENT_DIR/political-tracker-app" ]; then
    echo -e "${RED}❌ Error: political-tracker-app directory not found at $PARENT_DIR/political-tracker-app${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Source projects found${NC}"
echo ""

# Ask for confirmation
echo -e "${YELLOW}⚠️  This will copy your projects into the monorepo structure.${NC}"
echo -e "${YELLOW}   Your original projects will NOT be modified.${NC}"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "📦 Step 1: Creating directory structure..."
mkdir -p "$SCRIPT_DIR/apps/web"
mkdir -p "$SCRIPT_DIR/apps/mobile"
echo -e "${GREEN}✅ Directories created${NC}"

echo ""
echo "📋 Step 2: Copying web project (fenago21)..."
rsync -av --exclude='node_modules' --exclude='.next' --exclude='package-lock.json' "$PARENT_DIR/fenago21/" "$SCRIPT_DIR/apps/web/"
echo -e "${GREEN}✅ Web project copied${NC}"

echo ""
echo "📱 Step 3: Copying mobile project (political-tracker-app)..."
rsync -av --exclude='node_modules' --exclude='.expo' --exclude='package-lock.json' "$PARENT_DIR/political-tracker-app/" "$SCRIPT_DIR/apps/mobile/"
echo -e "${GREEN}✅ Mobile project copied${NC}"

echo ""
echo "🔧 Step 4: Updating web app package.json..."
cd "$SCRIPT_DIR/apps/web"

# Update package name
if command -v jq &> /dev/null; then
    jq '.name = "web"' package.json > package.json.tmp && mv package.json.tmp package.json
    jq '.dependencies["@efficacy/shared-types"] = "workspace:*"' package.json > package.json.tmp && mv package.json.tmp package.json
    jq '.dependencies["@efficacy/shared-constants"] = "workspace:*"' package.json > package.json.tmp && mv package.json.tmp package.json
    jq '.dependencies["@efficacy/shared-utils"] = "workspace:*"' package.json > package.json.tmp && mv package.json.tmp package.json
    echo -e "${GREEN}✅ Web package.json updated${NC}"
else
    echo -e "${YELLOW}⚠️  jq not installed, skipping package.json updates${NC}"
    echo -e "${YELLOW}   Please manually add shared package dependencies${NC}"
fi

echo ""
echo "📱 Step 5: Updating mobile app package.json..."
cd "$SCRIPT_DIR/apps/mobile"

if command -v jq &> /dev/null; then
    jq '.name = "mobile"' package.json > package.json.tmp && mv package.json.tmp package.json
    jq '.dependencies["@efficacy/shared-types"] = "workspace:*"' package.json > package.json.tmp && mv package.json.tmp package.json
    jq '.dependencies["@efficacy/shared-constants"] = "workspace:*"' package.json > package.json.tmp && mv package.json.tmp package.json
    jq '.dependencies["@efficacy/shared-utils"] = "workspace:*"' package.json > package.json.tmp && mv package.json.tmp package.json
    echo -e "${GREEN}✅ Mobile package.json updated${NC}"
else
    echo -e "${YELLOW}⚠️  jq not installed, skipping package.json updates${NC}"
fi

echo ""
echo "🌍 Step 6: Copying environment variables..."
if [ -f "$PARENT_DIR/political-tracker-app/.env" ]; then
    cp "$PARENT_DIR/political-tracker-app/.env" "$SCRIPT_DIR/.env"
    echo -e "${GREEN}✅ Environment variables copied${NC}"
else
    echo -e "${YELLOW}⚠️  No .env file found in political-tracker-app${NC}"
fi

echo ""
echo "📦 Step 7: Installing dependencies..."
cd "$SCRIPT_DIR"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo "Please install pnpm: npm install -g pnpm"
    echo "Then run: pnpm install"
    exit 1
fi

echo "Installing all dependencies (this may take a few minutes)..."
pnpm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

echo ""
echo "🎉 Migration Complete!"
echo "===================="
echo ""
echo "Next steps:"
echo ""
echo "1. Test the web app:"
echo "   cd $SCRIPT_DIR"
echo "   pnpm dev:web"
echo ""
echo "2. Test the mobile app:"
echo "   pnpm dev:mobile"
echo ""
echo "3. Review the migration guide:"
echo "   cat MIGRATION_GUIDE.md"
echo ""
echo "4. Update imports to use shared packages:"
echo "   - Replace local type imports with @efficacy/shared-types"
echo "   - Replace local constants with @efficacy/shared-constants"
echo ""
echo -e "${GREEN}✅ Your monorepo is ready!${NC}"
echo ""
