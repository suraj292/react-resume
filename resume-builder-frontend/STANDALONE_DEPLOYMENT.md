# Standalone Deployment Guide

## 📦 Build Process

After running `npm run build`, Next.js creates a standalone build optimized for production deployment.

## 🏗️ Understanding the Build Structure

```
.next/standalone/          # Self-contained production build
├── .next/                 # Next.js build output
├── node_modules/          # Only production dependencies
├── public/                # Static assets
├── package.json           # Production package.json
└── server.js              # Production server entry point
```

## ⚙️ Environment Variables in Standalone Mode

### **CRITICAL: How Environment Variables Work**

1. **Build Time Variables (`NEXT_PUBLIC_*`)**
   - These are **embedded into the JavaScript bundle** during `npm run build`
   - They **CANNOT** be changed after build without rebuilding
   - Examples: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`

2. **Runtime Variables (Server-side only)**
   - These can be set on the server when running the app
   - They are NOT accessible in client-side code
   - Examples: `DATABASE_URL`, `API_SECRET_KEY`

### **Current Configuration**

Your `.env.production` file:
```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://api.resumebp.com
NEXT_PUBLIC_APP_URL=https://resumebp.com
```

**Important Notes:**
- ✅ `NEXT_PUBLIC_API_URL=https://api.resumebp.com` (NO `/api` suffix)
- ✅ The code in `lib/api.ts` uses this as `baseURL` in axios
- ✅ Individual API calls add their paths (e.g., `/auth/login`)
- ✅ Final URL: `https://api.resumebp.com/auth/login`

## 📋 Deployment Steps

### **Step 1: Build the Application**

```bash
cd /Users/suraj/Sites/templates/resume-builder-frontend
npm run build
```

This creates `.next/standalone/` directory.

### **Step 2: Copy Files to Production Server**

Copy the following to your production server:

```bash
# Required files/folders
.next/standalone/          # Main build
.next/static/              # Static assets (IMPORTANT!)
public/                    # Public assets

# Optional (for reference)
.env.production           # NOT used at runtime, only during build
```

### **Step 3: Organize on Production Server**

Your current structure is correct:
```
standalone/
├── .next/
├── public/
├── node_modules/
├── package.json
└── server.js
```

**CRITICAL:** You must also copy `.next/static/` from your build:
```bash
# On your local machine
cp -r .next/static standalone/.next/static
```

### **Step 4: Run on Production Server**

#### **Option A: Using Node.js Directly**
```bash
cd standalone
NODE_ENV=production PORT=3000 node server.js
```

#### **Option B: Using PM2 (Recommended)**
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
cd standalone
pm2 start server.js --name "resume-builder" -i max

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

#### **Option C: Using systemd**
Create `/etc/systemd/system/resume-builder.service`:
```ini
[Unit]
Description=Resume Builder Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/standalone
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable resume-builder
sudo systemctl start resume-builder
```

## 🔄 Updating Environment Variables

### **If You Need to Change `NEXT_PUBLIC_*` Variables:**

**You MUST rebuild the application:**

1. Update `.env.production` locally
2. Run `npm run build`
3. Copy the new build to production server
4. Restart the application

### **Example: Changing API URL**

```bash
# 1. Update .env.production
echo "NEXT_PUBLIC_API_URL=https://new-api.resumebp.com" > .env.production

# 2. Rebuild
npm run build

# 3. Copy to production (example using rsync)
rsync -avz .next/standalone/ user@server:/path/to/standalone/
rsync -avz .next/static/ user@server:/path/to/standalone/.next/static/

# 4. Restart on production server
pm2 restart resume-builder
# OR
sudo systemctl restart resume-builder
```

## 🌐 Nginx Configuration (Recommended)

Use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name resumebp.com www.resumebp.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name resumebp.com www.resumebp.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

## 🐛 Troubleshooting

### **Issue: API calls going to wrong URL**

**Symptom:** Requests going to `https://resumebp.com/api` instead of `https://api.resumebp.com`

**Solution:**
1. Check `.env.production`: `NEXT_PUBLIC_API_URL=https://api.resumebp.com` (no `/api`)
2. Rebuild: `npm run build`
3. Redeploy the new build

### **Issue: Environment variables not loading**

**Remember:** 
- `.env.production` in the standalone folder is **NOT read at runtime**
- Variables are embedded during build
- To change them, you must rebuild

### **Issue: 404 errors for static assets**

**Solution:** Ensure you copied `.next/static/` to production:
```bash
cp -r .next/static standalone/.next/static
```

### **Issue: Application not starting**

**Check:**
```bash
# Verify Node.js version
node --version  # Should be 18.x or higher

# Check if port is available
lsof -i :3000

# Check logs
pm2 logs resume-builder
# OR
journalctl -u resume-builder -f
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] Application starts without errors
- [ ] Homepage loads correctly
- [ ] API calls go to `https://api.resumebp.com/*`
- [ ] Static assets load (images, CSS, JS)
- [ ] Authentication works
- [ ] All pages are accessible

## 📊 Monitoring

```bash
# PM2 monitoring
pm2 monit

# Check application status
pm2 status

# View logs
pm2 logs resume-builder --lines 100
```

## 🔐 Security Recommendations

1. **Use HTTPS** - Always use SSL/TLS in production
2. **Set proper CORS** - Configure your Laravel backend CORS settings
3. **Use environment variables** - Never hardcode secrets
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Use a process manager** - PM2 or systemd for auto-restart

## 📝 Quick Reference

| Task | Command |
|------|---------|
| Build | `npm run build` |
| Start (dev) | `npm run dev` |
| Start (prod) | `node server.js` |
| Start with PM2 | `pm2 start server.js` |
| Restart PM2 | `pm2 restart resume-builder` |
| View logs | `pm2 logs resume-builder` |
| Stop | `pm2 stop resume-builder` |

---

**Last Updated:** 2026-01-23  
**Next.js Version:** 16.1.1  
**Node.js Required:** 18.x or higher
