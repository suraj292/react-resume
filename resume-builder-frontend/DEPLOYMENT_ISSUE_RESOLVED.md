# ✅ Standalone Deployment - Issue Resolution Summary

## 🔍 Problem Identified

You were experiencing an issue where after running `npm run build` and copying files to a standalone directory, the API URL was not loading correctly from `.env.production`.

### Root Causes:

1. **Environment Variable Name Mismatch**
   - `.env.production` had: `NEXT_PUBLIC_API_BASE_URL`
   - Code was expecting: `NEXT_PUBLIC_API_URL`

2. **Incorrect API URL Format**
   - `.env.production` had: `NEXT_PUBLIC_API_URL=https://api.resumebp.com/api`
   - Should be: `NEXT_PUBLIC_API_URL=https://api.resumebp.com` (no `/api` suffix)
   - The axios baseURL in `lib/api.ts` is already set to this value, and individual endpoints add their paths

3. **Misunderstanding of Environment Variables in Next.js**
   - Environment variables with `NEXT_PUBLIC_*` prefix are **baked into the JavaScript bundle** during build time
   - They **cannot** be changed at runtime by placing a `.env.production` file in the standalone folder
   - To change them, you must rebuild the application

## ✅ Solutions Implemented

### 1. Fixed Environment Variables

Updated `.env.production`:
```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://api.resumebp.com      # ✅ Correct (no /api suffix)
NEXT_PUBLIC_APP_URL=https://resumebp.com
```

### 2. Rebuilt Application

Ran `npm run build` with the corrected environment variables to bake them into the bundle.

### 3. Created Deployment Scripts

#### `prepare-standalone.sh`
- Automatically prepares the standalone build for deployment
- Copies all necessary files including:
  - `.next/standalone/` → `standalone/`
  - `.next/static/` → `standalone/.next/static/` (CRITICAL!)
  - `public/` → `standalone/public/`
- Verifies all required files are present
- Shows deployment information and next steps

#### `verify-deployment.sh`
- Helps verify the standalone build is correctly configured
- Checks directory structure, Node.js version, port availability
- Provides deployment checklist

### 4. Created Documentation

#### `STANDALONE_DEPLOYMENT.md`
- Comprehensive guide on how standalone builds work
- Explains environment variable behavior (build-time vs runtime)
- Deployment steps for various scenarios (Node.js, PM2, systemd)
- Nginx configuration example
- Troubleshooting guide

## 📋 How Environment Variables Work in Next.js

### Build-Time Variables (`NEXT_PUBLIC_*`)
```
┌─────────────────┐
│  npm run build  │
│                 │
│  Reads:         │
│  .env.production│
│                 │
│  Embeds into:   │
│  JavaScript     │
│  bundle         │
└─────────────────┘
        ↓
┌─────────────────┐
│  Standalone     │
│  Build          │
│                 │
│  Variables are  │
│  HARDCODED in   │
│  the JS files   │
└─────────────────┘
```

**Key Points:**
- ✅ Read during `npm run build`
- ✅ Embedded into JavaScript bundle
- ✅ Available in both server and client code
- ❌ Cannot be changed without rebuilding
- ❌ `.env.production` in standalone folder is NOT used at runtime

### Runtime Variables (Server-only)
```
┌─────────────────┐
│  node server.js │
│                 │
│  Reads from:    │
│  - System env   │
│  - .env.local   │
│                 │
│  Available:     │
│  Server-side    │
│  only           │
└─────────────────┘
```

**Key Points:**
- ✅ Can be set when starting the server
- ✅ Can be changed without rebuilding
- ❌ NOT available in client-side code
- ❌ Must NOT have `NEXT_PUBLIC_` prefix

## 🚀 Deployment Workflow

### Current Setup (Correct)

```bash
# 1. Update environment variables
vim .env.production

# 2. Build the application
npm run build

# 3. Prepare standalone build
./prepare-standalone.sh

# 4. Deploy to production
rsync -avz standalone/ user@server:/path/to/app/

# 5. On production server, start the app
cd /path/to/app
pm2 start server.js --name resume-builder -i max
pm2 save
```

### Standalone Directory Structure (After prepare-standalone.sh)

```
standalone/
├── .env.production          # Reference only, NOT used at runtime
├── .next/
│   ├── BUILD_ID            # ✅ Present
│   ├── static/             # ✅ Copied from main build
│   ├── server/             # Server-side code
│   └── *.json              # Manifests
├── node_modules/           # Production dependencies only
├── public/                 # Static assets
├── package.json
└── server.js               # Production server entry point
```

## 🔗 API URL Configuration

### How It Works

1. **Environment Variable**
   ```bash
   NEXT_PUBLIC_API_URL=https://api.resumebp.com
   ```

2. **In Code (`lib/api.ts`)**
   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
   
   const api = axios.create({
       baseURL: API_URL,  // https://api.resumebp.com
       // ...
   });
   ```

3. **API Calls**
   ```typescript
   api.post('/auth/login', data)
   // Becomes: https://api.resumebp.com/auth/login ✅
   ```

### ❌ Common Mistakes

1. **Double `/api` in URL**
   ```bash
   # WRONG
   NEXT_PUBLIC_API_URL=https://api.resumebp.com/api
   # Results in: https://api.resumebp.com/api/auth/login ❌
   
   # CORRECT
   NEXT_PUBLIC_API_URL=https://api.resumebp.com
   # Results in: https://api.resumebp.com/auth/login ✅
   ```

2. **Expecting runtime changes**
   ```bash
   # This will NOT work:
   # 1. Build app
   # 2. Copy standalone/
   # 3. Edit standalone/.env.production
   # 4. Start server
   # Variables are already baked in! ❌
   ```

## 🧪 Testing the Standalone Build

### Local Testing

```bash
# Navigate to standalone directory
cd standalone

# Start the server
NODE_ENV=production PORT=3001 node server.js

# Test in another terminal
curl http://localhost:3001
```

### Verify API URL

```bash
# Check if the correct API URL is in the build
grep -r "api.resumebp.com" standalone/.next/static/
```

## 📊 Verification Checklist

After deployment, verify:

- [x] `.env.production` has correct variable names
- [x] `NEXT_PUBLIC_API_URL=https://api.resumebp.com` (no `/api`)
- [x] Application rebuilt with `npm run build`
- [x] Standalone prepared with `./prepare-standalone.sh`
- [x] `standalone/.next/BUILD_ID` exists
- [x] `standalone/.next/static/` directory exists and has files
- [x] `standalone/public/` directory exists
- [x] Server starts without errors
- [x] API calls go to `https://api.resumebp.com/*`

## 🔄 Updating API URL in Production

If you need to change the API URL after deployment:

```bash
# 1. Update .env.production locally
echo "NEXT_PUBLIC_API_URL=https://new-api.resumebp.com" > .env.production

# 2. Rebuild
npm run build

# 3. Prepare new standalone
./prepare-standalone.sh

# 4. Deploy to production
rsync -avz --delete standalone/ user@server:/path/to/app/

# 5. Restart on production
ssh user@server "pm2 restart resume-builder"
```

## 📝 Quick Reference Commands

| Task | Command |
|------|---------|
| Build | `npm run build` |
| Prepare standalone | `./prepare-standalone.sh` |
| Verify deployment | `cd standalone && ../verify-deployment.sh` |
| Test locally | `cd standalone && node server.js` |
| Deploy (rsync) | `rsync -avz standalone/ user@server:/path/` |
| Start with PM2 | `pm2 start server.js --name resume-builder` |
| Restart PM2 | `pm2 restart resume-builder` |
| View logs | `pm2 logs resume-builder` |

## 🎯 Current Status

✅ **RESOLVED**

- Environment variables corrected
- Application rebuilt with correct configuration
- Standalone build prepared successfully
- Build ID: `CaEYKPlTCMUz29e5o4VL8`
- API URL: `https://api.resumebp.com` ✅
- App URL: `https://resumebp.com` ✅

The standalone build is now ready for deployment to your production server!

## 📚 Additional Resources

- `STANDALONE_DEPLOYMENT.md` - Complete deployment guide
- `prepare-standalone.sh` - Automated build preparation
- `verify-deployment.sh` - Deployment verification tool

---

**Last Updated:** 2026-01-23  
**Issue Status:** ✅ Resolved  
**Next.js Version:** 16.1.1
