# 🚀 Quick Start - Production Deployment

## TL;DR

```bash
# 1. Build
npm run build

# 2. Prepare standalone
./prepare-standalone.sh

# 3. Deploy
rsync -avz standalone/ user@server:/var/www/resume-builder/

# 4. On server, start with PM2
ssh user@server
cd /var/www/resume-builder
pm2 start server.js --name resume-builder -i max
pm2 save
pm2 startup
```

## ⚠️ Important Notes

### Environment Variables

**CRITICAL:** Environment variables with `NEXT_PUBLIC_*` prefix are **baked into the build** at build time.

✅ **Correct Workflow:**
1. Update `.env.production`
2. Run `npm run build`
3. Deploy the new build

❌ **This Will NOT Work:**
1. Build once
2. Deploy
3. Edit `.env.production` on server
4. Restart server
5. Expect changes to take effect ← **Variables are already in the JS bundle!**

### Current Configuration

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.resumebp.com      # NO /api suffix!
NEXT_PUBLIC_APP_URL=https://resumebp.com
```

**Why no `/api` suffix?**
- The code uses `axios.create({ baseURL: API_URL })`
- Individual calls add paths: `api.post('/auth/login')`
- Result: `https://api.resumebp.com/auth/login` ✅

## 📦 What Gets Deployed

```
standalone/
├── .next/              # Next.js build (with BUILD_ID, static/, server/)
├── node_modules/       # Production dependencies only
├── public/             # Static assets
├── package.json
└── server.js           # Entry point
```

## 🔧 Production Server Setup

### Option 1: PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start server.js --name resume-builder -i max

# Save configuration
pm2 save

# Setup auto-start on boot
pm2 startup
# Follow the command it outputs

# Useful commands
pm2 status
pm2 logs resume-builder
pm2 restart resume-builder
pm2 stop resume-builder
```

### Option 2: Systemd

Create `/etc/systemd/system/resume-builder.service`:

```ini
[Unit]
Description=Resume Builder Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/resume-builder
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
sudo systemctl status resume-builder
```

### Option 3: Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name resumebp.com www.resumebp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name resumebp.com www.resumebp.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

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

    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

## 🔄 Update Workflow

```bash
# On local machine
git pull                    # Get latest code
npm install                 # Update dependencies
npm run build              # Build with latest code
./prepare-standalone.sh    # Prepare deployment

# Deploy
rsync -avz --delete standalone/ user@server:/var/www/resume-builder/

# On server
pm2 restart resume-builder
```

## 🐛 Troubleshooting

### API calls going to wrong URL

**Check:**
```bash
# 1. Verify .env.production
cat .env.production

# 2. Rebuild if needed
npm run build
./prepare-standalone.sh

# 3. Redeploy
```

### Server won't start

**Check:**
```bash
# Node version (needs 18+)
node --version

# Port availability
lsof -i :3000

# Logs
pm2 logs resume-builder
# or
journalctl -u resume-builder -f
```

### Static files not loading

**Check:**
```bash
# Ensure .next/static exists
ls -la standalone/.next/static/

# If missing, run prepare-standalone.sh again
./prepare-standalone.sh
```

## 📞 Need Help?

1. Check `DEPLOYMENT_ISSUE_RESOLVED.md` for detailed explanation
2. Check `STANDALONE_DEPLOYMENT.md` for comprehensive guide
3. Run `./verify-deployment.sh` in standalone directory

---

**Build ID:** `CaEYKPlTCMUz29e5o4VL8`  
**Status:** ✅ Ready for deployment
