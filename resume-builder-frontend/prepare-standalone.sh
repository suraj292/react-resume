#!/bin/bash

# Resume Builder - Standalone Build Preparation Script
# This script prepares the standalone build for production deployment

set -e  # Exit on error

echo "🚀 Resume Builder - Standalone Build Preparation"
echo "================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BUILD_DIR=".next/standalone"
DEPLOY_DIR="standalone"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="standalone_backup_${TIMESTAMP}"

# Step 1: Check if build exists
echo "📋 Step 1: Checking build..."
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Error: Build directory not found!${NC}"
    echo "Please run 'npm run build' first"
    exit 1
fi
echo -e "${GREEN}✅ Build directory found${NC}"
echo ""

# Step 2: Backup existing standalone if it exists
if [ -d "$DEPLOY_DIR" ]; then
    echo "📦 Step 2: Backing up existing standalone..."
    mv "$DEPLOY_DIR" "$BACKUP_DIR"
    echo -e "${GREEN}✅ Backup created: $BACKUP_DIR${NC}"
else
    echo "📦 Step 2: No existing standalone to backup"
fi
echo ""

# Step 3: Create deployment directory
echo "📁 Step 3: Creating deployment directory..."
mkdir -p "$DEPLOY_DIR"
echo -e "${GREEN}✅ Deployment directory created${NC}"
echo ""

# Step 4: Copy standalone build
echo "📋 Step 4: Copying standalone build..."
rsync -a "$BUILD_DIR/" "$DEPLOY_DIR/"
echo -e "${GREEN}✅ Standalone build copied${NC}"
echo ""

# Step 5: Copy static files from main build (CRITICAL!)
echo "📋 Step 5: Copying static files from main build..."
if [ -d ".next/static" ]; then
    rsync -a .next/static/ "$DEPLOY_DIR/.next/static/"
    echo -e "${GREEN}✅ Static files copied${NC}"
else
    echo -e "${RED}❌ Warning: .next/static not found!${NC}"
fi
echo ""

# Step 6: Copy public directory
echo "📋 Step 6: Copying public directory..."
if [ -d "public" ]; then
    cp -r public "$DEPLOY_DIR/"
    echo -e "${GREEN}✅ Public directory copied${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: public directory not found${NC}"
fi
echo ""

# Step 7: Copy environment file (for reference only)
echo "📋 Step 7: Copying environment file..."
if [ -f ".env.production" ]; then
    cp .env.production "$DEPLOY_DIR/.env.production"
    echo -e "${YELLOW}ℹ️  .env.production copied (for reference only)${NC}"
    echo -e "${YELLOW}   Remember: Environment variables are baked into the build!${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: .env.production not found${NC}"
fi
echo ""

# Step 8: Verify deployment structure
echo "📋 Step 8: Verifying deployment structure..."
MISSING_FILES=0

if [ ! -f "$DEPLOY_DIR/server.js" ]; then
    echo -e "${RED}❌ Missing: server.js${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
fi

if [ ! -f "$DEPLOY_DIR/package.json" ]; then
    echo -e "${RED}❌ Missing: package.json${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
fi

if [ ! -d "$DEPLOY_DIR/.next" ]; then
    echo -e "${RED}❌ Missing: .next directory${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
fi

if [ ! -d "$DEPLOY_DIR/.next/static" ]; then
    echo -e "${RED}❌ Missing: .next/static directory${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
fi

if [ ! -d "$DEPLOY_DIR/public" ]; then
    echo -e "${YELLOW}⚠️  Missing: public directory${NC}"
fi

if [ $MISSING_FILES -eq 0 ]; then
    echo -e "${GREEN}✅ All critical files present${NC}"
else
    echo -e "${RED}❌ Missing $MISSING_FILES critical files!${NC}"
    exit 1
fi
echo ""

# Step 9: Display deployment info
echo "================================================="
echo -e "${GREEN}✅ Standalone build prepared successfully!${NC}"
echo "================================================="
echo ""
echo "📊 Deployment Information:"
echo "  Location: $(pwd)/$DEPLOY_DIR"
echo "  Build ID: $(cat $DEPLOY_DIR/.next/BUILD_ID 2>/dev/null || echo 'N/A')"
echo ""

# Check .env.production for API URL
if [ -f "$DEPLOY_DIR/.env.production" ]; then
    API_URL=$(grep NEXT_PUBLIC_API_URL "$DEPLOY_DIR/.env.production" | cut -d'=' -f2)
    APP_URL=$(grep NEXT_PUBLIC_APP_URL "$DEPLOY_DIR/.env.production" | cut -d'=' -f2)
    echo "🔗 Configuration (baked into build):"
    echo "  API URL: $API_URL"
    echo "  APP URL: $APP_URL"
    echo ""
fi

echo "📦 Directory Structure:"
du -sh "$DEPLOY_DIR" 2>/dev/null || echo "  Size calculation unavailable"
echo ""

echo "📋 Next Steps:"
echo ""
echo "1️⃣  Test locally:"
echo "   cd $DEPLOY_DIR"
echo "   NODE_ENV=production PORT=3000 node server.js"
echo ""
echo "2️⃣  Deploy to production server:"
echo "   rsync -avz --delete $DEPLOY_DIR/ user@server:/path/to/app/"
echo "   # OR"
echo "   scp -r $DEPLOY_DIR user@server:/path/to/app/"
echo ""
echo "3️⃣  On production server, start with PM2:"
echo "   cd /path/to/app"
echo "   pm2 start server.js --name resume-builder -i max"
echo "   pm2 save"
echo ""
echo "4️⃣  Setup Nginx reverse proxy (recommended)"
echo "   See STANDALONE_DEPLOYMENT.md for Nginx configuration"
echo ""

if [ -d "$BACKUP_DIR" ]; then
    echo "💾 Backup Information:"
    echo "  Previous deployment backed up to: $BACKUP_DIR"
    echo "  You can delete it after verifying the new deployment"
    echo ""
fi

echo "================================================="
echo "🎉 Ready for deployment!"
echo "================================================="
