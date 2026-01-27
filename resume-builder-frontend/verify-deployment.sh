#!/bin/bash

# Deployment Verification Script
# This script helps verify your standalone build is configured correctly

echo "🔍 Resume Builder - Deployment Verification"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Are you in the standalone directory?"
    exit 1
fi

echo "✅ Found server.js"
echo ""

# Check for required directories
echo "📁 Checking directory structure..."
if [ -d ".next" ]; then
    echo "  ✅ .next/ directory exists"
else
    echo "  ❌ .next/ directory missing"
fi

if [ -d ".next/static" ]; then
    echo "  ✅ .next/static/ directory exists"
else
    echo "  ⚠️  .next/static/ directory missing - COPY THIS FROM BUILD!"
fi

if [ -d "public" ]; then
    echo "  ✅ public/ directory exists"
else
    echo "  ❌ public/ directory missing"
fi

if [ -d "node_modules" ]; then
    echo "  ✅ node_modules/ directory exists"
else
    echo "  ❌ node_modules/ directory missing"
fi

echo ""

# Check Node.js version
echo "🔧 Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "  Node.js version: $NODE_VERSION"

# Extract major version
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
if [ "$MAJOR_VERSION" -ge 18 ]; then
    echo "  ✅ Node.js version is compatible (18+)"
else
    echo "  ⚠️  Node.js version should be 18 or higher"
fi

echo ""

# Check if port 3000 is available
echo "🌐 Checking port availability..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  ⚠️  Port 3000 is already in use"
    echo "  Process using port 3000:"
    lsof -Pi :3000 -sTCP:LISTEN
else
    echo "  ✅ Port 3000 is available"
fi

echo ""

# Check environment variables (if .env.production exists)
echo "🔐 Environment Configuration..."
if [ -f ".env.production" ]; then
    echo "  ℹ️  .env.production found (NOTE: This is NOT used at runtime)"
    echo "  Environment variables are baked into the build"
else
    echo "  ℹ️  No .env.production file (this is normal for standalone)"
fi

echo ""

# Try to extract API URL from build (if possible)
echo "🔗 Checking API Configuration..."
if [ -f ".next/BUILD_ID" ]; then
    BUILD_ID=$(cat .next/BUILD_ID)
    echo "  Build ID: $BUILD_ID"
fi

echo ""
echo "📝 Deployment Checklist:"
echo "  [ ] .next/static/ directory copied from build"
echo "  [ ] public/ directory copied from build"
echo "  [ ] Node.js version 18 or higher"
echo "  [ ] Port 3000 is available (or configure different port)"
echo "  [ ] API backend is running and accessible"
echo "  [ ] CORS configured on backend for your domain"
echo ""

echo "🚀 To start the application:"
echo "  Development: NODE_ENV=production PORT=3000 node server.js"
echo "  Production:  pm2 start server.js --name resume-builder"
echo ""

echo "🧪 To test the application:"
echo "  curl http://localhost:3000"
echo ""

echo "==========================================="
echo "Verification complete!"
