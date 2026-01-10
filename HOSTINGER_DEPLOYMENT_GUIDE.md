# 🚀 Complete Hostinger Deployment Guide
## Resume Builder (Laravel + Next.js)

**Last Updated:** January 10, 2026  
**Deployment Type:** Shared Hosting (SSH Access Required)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance & Updates](#maintenance--updates)

---

## Prerequisites

### What You Need

✅ **Hostinger Account:**
- Shared hosting plan with SSH access
- PHP 8.2+ support
- MySQL database access
- Minimum 1GB storage
- Domain configured and pointing to Hostinger

✅ **Local Development:**
- Node.js 18+ installed
- Composer installed
- Git (optional but recommended)
- Terminal/Command line access

✅ **Third-Party Services:**
- Google OAuth credentials (optional)
- LinkedIn OAuth credentials (optional)
- GitHub OAuth credentials (optional)

---

## Architecture Overview

### Final Directory Structure on Hostinger

```
yourdomain.com (public_html/)
├── index.html              ← Next.js homepage
├── _next/                  ← Next.js static assets
│   ├── static/
│   └── ...
├── pricing.html            ← Static pages
├── blog.html
├── builder.html
├── api/                    ← Laravel backend
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/             ← Laravel entry point
│   │   └── index.php
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env                ← Production config
│   └── artisan
├── .htaccess               ← Root routing
└── robots.txt
```

### How It Works

1. **Frontend (Next.js):** Static HTML files served from `public_html/`
2. **Backend (Laravel):** API requests routed to `public_html/api/public/`
3. **Routing:** `.htaccess` handles URL rewriting
4. **Database:** MySQL database managed via cPanel

---

## Pre-Deployment Checklist

### ✅ Before You Start

- [ ] Backup your local code
- [ ] Test application locally (both frontend and backend)
- [ ] Have Hostinger cPanel credentials ready
- [ ] Have SSH credentials ready
- [ ] Domain DNS is pointing to Hostinger
- [ ] SSL certificate is active (Hostinger provides free SSL)

---

## Step-by-Step Deployment

### 🔧 STEP 1: Prepare Backend (Laravel)

#### 1.1 Configure Production Environment

Navigate to your backend directory:

```bash
cd /Users/suraj/Sites/templates/resume-builder-backend
```

Create production `.env` file:

```bash
cp .env .env.production
```

Edit `.env.production` with your production settings:

```env
APP_NAME="Resume Builder"
APP_ENV=production
APP_KEY=                    # Will generate later
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database - Get these from Hostinger cPanel → MySQL Databases
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456789_resumedb
DB_USERNAME=u123456789_dbuser
DB_PASSWORD=your_strong_password_here

# Session & Cache
SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Sanctum Configuration
SESSION_DOMAIN=.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com

# Mail Configuration (Hostinger SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

# Google OAuth (update after creating OAuth app)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=https://yourdomain.com/api/auth/linkedin/callback

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=https://yourdomain.com/api/auth/github/callback

# Cache Revalidation Secret
REVALIDATE_SECRET=
```

#### 1.2 Generate Application Key

```bash
php artisan key:generate --env=production
```

This will update `APP_KEY` in `.env.production`.

#### 1.3 Generate Revalidation Secret

```bash
openssl rand -base64 32
```

Copy the output and add it to `REVALIDATE_SECRET` in `.env.production`.

#### 1.4 Install Production Dependencies

```bash
composer install --optimize-autoloader --no-dev
```

#### 1.5 Create Backend Deployment Package

```bash
# Create a zip excluding unnecessary files
zip -r backend-deploy.zip . \
  -x "*.git*" \
  -x "node_modules/*" \
  -x "tests/*" \
  -x "*.md" \
  -x ".env.example" \
  -x ".env" \
  -x "storage/logs/*" \
  -x "storage/framework/cache/*" \
  -x "storage/framework/sessions/*" \
  -x "storage/framework/views/*"
```

**Result:** You now have `backend-deploy.zip` ready for upload.

---

### 🎨 STEP 2: Prepare Frontend (Next.js)

#### 2.1 Configure Production Environment

Navigate to frontend directory:

```bash
cd /Users/suraj/Sites/templates/resume-builder-frontend
```

Create `.env.production.local`:

```bash
cat > .env.production.local << 'EOF'
# Production API URL
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
EOF
```

**Replace `yourdomain.com` with your actual domain!**

#### 2.2 Install Dependencies

```bash
npm install
```

#### 2.3 Build Static Export

```bash
npm run build
```

This creates an `out/` directory with all static files.

#### 2.4 Verify Build

Check that `out/` directory exists and contains:

```bash
ls -la out/
```

You should see:
- `index.html`
- `_next/` directory
- Various `.html` files (pricing.html, blog.html, etc.)
- `robots.txt`, `sitemap.xml`

**Result:** Your frontend is built and ready in the `out/` directory.

---

### 📦 STEP 3: Create Complete Deployment Package (Automated)

Use the deployment script to create a complete package:

```bash
cd /Users/suraj/Sites/templates
chmod +x deploy-to-hostinger.sh
./deploy-to-hostinger.sh
```

This script will:
1. ✅ Prepare backend with optimizations
2. ✅ Build frontend static export
3. ✅ Create deployment package with correct structure
4. ✅ Generate all necessary `.htaccess` files
5. ✅ Create a `.tar.gz` archive ready for upload

**Result:** You'll have a `hostinger-deploy-YYYYMMDD-HHMMSS.tar.gz` file.

---

### 🌐 STEP 4: Set Up Hostinger Database

#### 4.1 Create MySQL Database

1. Login to **Hostinger cPanel**
2. Go to **Databases → MySQL Databases**
3. Create new database:
   - Database name: `resumedb` (will become `u123456789_resumedb`)
   - Click **Create**

#### 4.2 Create Database User

1. In the same page, scroll to **MySQL Users**
2. Create new user:
   - Username: `dbuser` (will become `u123456789_dbuser`)
   - Password: Generate a strong password
   - Click **Create User**

#### 4.3 Add User to Database

1. Scroll to **Add User To Database**
2. Select the user you created
3. Select the database you created
4. Click **Add**
5. Grant **ALL PRIVILEGES**
6. Click **Make Changes**

**Important:** Note down these credentials:
- Database name: `u123456789_resumedb`
- Username: `u123456789_dbuser`
- Password: (the one you generated)
- Host: `localhost`

---

### 📤 STEP 5: Upload to Hostinger

#### 5.1 Connect via SSH

Get your SSH details from Hostinger cPanel → **Advanced → SSH Access**.

```bash
ssh u123456789@yourdomain.com -p 65002
```

Replace `u123456789` with your actual Hostinger username.

#### 5.2 Navigate to public_html

```bash
cd ~/public_html
```

#### 5.3 Backup Existing Files (if any)

```bash
# Only if you have existing files
mkdir ~/backup-$(date +%Y%m%d)
mv * ~/backup-$(date +%Y%m%d)/ 2>/dev/null || true
```

#### 5.4 Upload Deployment Package

**Option A: Using SCP (from your local machine in a new terminal)**

```bash
scp -P 65002 hostinger-deploy-*.tar.gz u123456789@yourdomain.com:~/public_html/
```

**Option B: Using cPanel File Manager**

1. Go to cPanel → **Files → File Manager**
2. Navigate to `public_html/`
3. Click **Upload**
4. Upload the `.tar.gz` file
5. After upload, right-click → **Extract**

#### 5.5 Extract and Organize Files (via SSH)

```bash
cd ~/public_html

# Extract the archive
tar -xzf hostinger-deploy-*.tar.gz

# Move files from extracted directory to public_html
mv hostinger-deploy-*/* .
mv hostinger-deploy-*/.[!.]* . 2>/dev/null || true

# Clean up
rm -rf hostinger-deploy-*
rm hostinger-deploy-*.tar.gz
```

#### 5.6 Verify Directory Structure

```bash
ls -la
```

You should see:
- `index.html`
- `_next/` directory
- `api/` directory
- `.htaccess`

---

### ⚙️ STEP 6: Configure Backend

#### 6.1 Update .env File

```bash
cd ~/public_html/api
nano .env
```

Update the database credentials and other settings:

```env
DB_DATABASE=u123456789_resumedb
DB_USERNAME=u123456789_dbuser
DB_PASSWORD=your_actual_password

APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

#### 6.2 Set Correct Permissions

```bash
cd ~/public_html/api

# Set directory permissions
find . -type d -exec chmod 755 {} \;

# Set file permissions
find . -type f -exec chmod 644 {} \;

# Make storage and cache writable
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Make artisan executable
chmod +x artisan
```

#### 6.3 Run Migrations

```bash
cd ~/public_html/api
php artisan migrate --force
```

If you get an error, try:

```bash
php8.2 artisan migrate --force
```

#### 6.4 Seed Database

```bash
php artisan db:seed --force
```

This will populate:
- Resume templates
- Pricing plans
- SEO data
- Blog posts and categories

#### 6.5 Cache Configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

### 🔐 STEP 7: Configure OAuth Providers

#### 7.1 Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new one)
3. Navigate to **APIs & Services → Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   ```
   https://yourdomain.com/api/auth/google/callback
   ```
6. Save changes
7. Copy **Client ID** and **Client Secret**
8. Update `.env`:
   ```bash
   nano ~/public_html/api/.env
   ```
   Add:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

#### 7.2 LinkedIn OAuth (Optional)

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Select your app
3. Go to **Auth** tab
4. Add Redirect URL:
   ```
   https://yourdomain.com/api/auth/linkedin/callback
   ```
5. Update `.env` with credentials

#### 7.3 GitHub OAuth (Optional)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Select your OAuth App
3. Update **Authorization callback URL**:
   ```
   https://yourdomain.com/api/auth/github/callback
   ```
4. Update `.env` with credentials

#### 7.4 Clear Config Cache

```bash
cd ~/public_html/api
php artisan config:clear
php artisan config:cache
```

---

### ⏰ STEP 8: Set Up Cron Jobs

Laravel's scheduler needs to run every minute.

#### 8.1 Via cPanel

1. Go to cPanel → **Advanced → Cron Jobs**
2. Under **Add New Cron Job**:
   - **Common Settings:** Every Minute (* * * * *)
   - **Command:**
     ```bash
     cd /home/u123456789/public_html/api && /usr/bin/php8.2 artisan schedule:run >> /dev/null 2>&1
     ```
   - Replace `u123456789` with your actual username
3. Click **Add New Cron Job**

#### 8.2 Verify Cron Job

The cron job will handle:
- Cache cleanup
- Session cleanup
- Scheduled tasks
- Queue processing (if using queues)

---

## Post-Deployment Configuration

### 🔒 Security Hardening

#### 1. Verify .env is Protected

```bash
cd ~/public_html/api
chmod 600 .env
```

#### 2. Disable Directory Listing

The `.htaccess` files already include `Options -Indexes`, but verify:

```bash
cat ~/public_html/.htaccess | grep "Indexes"
```

#### 3. Force HTTPS

The root `.htaccess` already forces HTTPS. Verify it's working:

```bash
curl -I http://yourdomain.com
```

Should return a 301 redirect to HTTPS.

#### 4. Configure PHP Settings

Go to cPanel → **Select PHP Version → Options**

Set:
```ini
memory_limit = 256M
max_execution_time = 300
upload_max_filesize = 10M
post_max_size = 10M
opcache.enable = 1
opcache.memory_consumption = 128
opcache.max_accelerated_files = 10000
```

---

### 📧 Email Configuration

#### 1. Create Email Account

1. cPanel → **Email → Email Accounts**
2. Create: `noreply@yourdomain.com`
3. Set a strong password

#### 2. Update .env

```bash
nano ~/public_html/api/.env
```

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

#### 3. Test Email

```bash
cd ~/public_html/api
php artisan tinker
```

Then run:
```php
Mail::raw('Test email', function($msg) {
    $msg->to('your@email.com')->subject('Test');
});
exit
```

---

## Testing & Verification

### ✅ Test Checklist

#### 1. Test Homepage

```bash
curl -I https://yourdomain.com
```

Should return `200 OK` and serve `index.html`.

#### 2. Test API Health

```bash
curl https://yourdomain.com/api/health
```

Should return JSON with status.

#### 3. Test API Endpoints

```bash
# Pricing plans
curl https://yourdomain.com/api/pricing-plans

# Templates
curl https://yourdomain.com/api/templates

# SEO data
curl https://yourdomain.com/api/seo?route=/
```

#### 4. Test Frontend Pages

Visit in browser:
- ✅ `https://yourdomain.com` - Homepage
- ✅ `https://yourdomain.com/pricing` - Pricing page
- ✅ `https://yourdomain.com/blog` - Blog listing
- ✅ `https://yourdomain.com/ats-checker` - ATS Checker
- ✅ `https://yourdomain.com/builder` - Resume Builder

#### 5. Test Authentication

1. Go to `https://yourdomain.com/login`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Verify redirect back to site
5. Check if user is logged in

#### 6. Test Resume Builder

1. Login to your account
2. Go to Resume Builder
3. Create a new resume
4. Add sections (experience, education, skills)
5. Try different templates
6. Download PDF
7. Test ATS checker

---

## Troubleshooting

### 🔧 Common Issues & Solutions

#### Issue 1: 500 Internal Server Error

**Symptoms:** White page or "500 Internal Server Error"

**Solutions:**

1. **Check Laravel logs:**
   ```bash
   tail -50 ~/public_html/api/storage/logs/laravel.log
   ```

2. **Check file permissions:**
   ```bash
   cd ~/public_html/api
   chmod -R 775 storage bootstrap/cache
   ```

3. **Clear all caches:**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

4. **Check .htaccess files exist:**
   ```bash
   ls -la ~/public_html/.htaccess
   ls -la ~/public_html/api/.htaccess
   ls -la ~/public_html/api/public/.htaccess
   ```

---

#### Issue 2: API Returns 404

**Symptoms:** API calls return 404 Not Found

**Solutions:**

1. **Test direct access:**
   ```bash
   curl https://yourdomain.com/api/public/index.php
   ```

2. **Check .htaccess rewrite rules:**
   ```bash
   cat ~/public_html/.htaccess | grep "api"
   ```

3. **Verify mod_rewrite is enabled:**
   Contact Hostinger support to confirm `mod_rewrite` is enabled.

4. **Check API directory structure:**
   ```bash
   ls -la ~/public_html/api/public/
   ```
   Should contain `index.php`.

---

#### Issue 3: Database Connection Failed

**Symptoms:** "SQLSTATE[HY000] [1045] Access denied"

**Solutions:**

1. **Verify credentials in .env:**
   ```bash
   cat ~/public_html/api/.env | grep DB_
   ```

2. **Test database connection:**
   ```bash
   cd ~/public_html/api
   php artisan tinker
   ```
   Then:
   ```php
   DB::connection()->getPdo();
   exit
   ```

3. **Check database exists:**
   - Login to cPanel → phpMyAdmin
   - Verify database and user exist

4. **Use localhost for DB_HOST:**
   ```env
   DB_HOST=localhost  # NOT 127.0.0.1
   ```

---

#### Issue 4: CORS Errors

**Symptoms:** Browser console shows CORS errors

**Solutions:**

1. **Update CORS config:**
   ```bash
   nano ~/public_html/api/config/cors.php
   ```
   
   Ensure:
   ```php
   'allowed_origins' => [env('FRONTEND_URL')],
   'supports_credentials' => true,
   ```

2. **Clear config cache:**
   ```bash
   php artisan config:clear
   php artisan config:cache
   ```

3. **Verify FRONTEND_URL in .env:**
   ```bash
   cat ~/public_html/api/.env | grep FRONTEND_URL
   ```

---

#### Issue 5: Static Assets 404

**Symptoms:** Images, CSS, JS files return 404

**Solutions:**

1. **Check _next directory exists:**
   ```bash
   ls -la ~/public_html/_next/
   ```

2. **Verify file permissions:**
   ```bash
   find ~/public_html/_next -type f -exec chmod 644 {} \;
   find ~/public_html/_next -type d -exec chmod 755 {} \;
   ```

3. **Check .htaccess static file rules:**
   ```bash
   cat ~/public_html/.htaccess | grep "REQUEST_FILENAME"
   ```

---

#### Issue 6: OAuth Redirect Mismatch

**Symptoms:** "redirect_uri_mismatch" error

**Solutions:**

1. **Verify exact redirect URI in OAuth provider:**
   - Must match exactly: `https://yourdomain.com/api/auth/google/callback`
   - Include `https://`
   - No trailing slash

2. **Update .env:**
   ```bash
   nano ~/public_html/api/.env
   ```
   
   Ensure:
   ```env
   GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
   ```

3. **Clear config cache:**
   ```bash
   php artisan config:cache
   ```

---

#### Issue 7: Session/Cookie Not Working

**Symptoms:** User gets logged out immediately

**Solutions:**

1. **Update session domain:**
   ```bash
   nano ~/public_html/api/.env
   ```
   
   ```env
   SESSION_DOMAIN=.yourdomain.com
   SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
   ```

2. **Clear config cache:**
   ```bash
   php artisan config:cache
   ```

3. **Check session driver:**
   ```env
   SESSION_DRIVER=database
   ```

4. **Verify sessions table exists:**
   ```bash
   php artisan tinker
   ```
   ```php
   DB::table('sessions')->count();
   exit
   ```

---

#### Issue 8: Slow Performance

**Solutions:**

1. **Enable OPcache:**
   - cPanel → Select PHP Version → Options
   - Enable `opcache.enable`

2. **Cache everything:**
   ```bash
   cd ~/public_html/api
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Optimize Composer autoloader:**
   ```bash
   composer dump-autoload --optimize
   ```

4. **Check database indexes:**
   - Ensure migrations created proper indexes

---

## Maintenance & Updates

### 📅 Regular Maintenance Tasks

#### Weekly Tasks

```bash
# Check error logs
tail -100 ~/public_html/api/storage/logs/laravel.log

# Check disk usage
du -sh ~/public_html

# Check database size
# Via cPanel → phpMyAdmin
```

#### Monthly Tasks

```bash
# Backup database
# Via cPanel → phpMyAdmin → Export

# Backup files
cd ~
tar -czf backup-$(date +%Y%m%d).tar.gz public_html/

# Download backup
# Via cPanel → File Manager → Download
```

---

### 🔄 Updating Your Application

#### Backend Updates

```bash
# Connect via SSH
ssh u123456789@yourdomain.com -p 65002

# Navigate to backend
cd ~/public_html/api

# Pull latest code (if using Git)
git pull origin main

# Install dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Clear and recache
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Frontend Updates

**On local machine:**

```bash
# Navigate to frontend
cd /Users/suraj/Sites/templates/resume-builder-frontend

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build
npm run build
```

**Upload to server:**

```bash
# Upload new build
scp -P 65002 -r out/* u123456789@yourdomain.com:~/public_html/
```

---

### 📊 Monitoring

#### Set Up Uptime Monitoring

Use free services:
- **UptimeRobot:** https://uptimerobot.com
- **Pingdom:** https://www.pingdom.com
- **StatusCake:** https://www.statuscake.com

Monitor:
- `https://yourdomain.com` - Homepage
- `https://yourdomain.com/api/health` - API health

#### Error Monitoring

Check logs regularly:

```bash
# Last 50 errors
tail -50 ~/public_html/api/storage/logs/laravel.log

# Follow logs in real-time
tail -f ~/public_html/api/storage/logs/laravel.log
```

---

## 🎉 Deployment Complete!

### What You've Deployed

✅ **Frontend (Next.js Static):**
- Homepage, Pricing, Blog, ATS Checker, Resume Builder
- Optimized static HTML files
- Cached assets with long expiry

✅ **Backend (Laravel API):**
- RESTful API endpoints
- Database with migrations and seeders
- OAuth authentication (Google, LinkedIn, GitHub)
- Email configuration
- Cron jobs for scheduled tasks

✅ **Infrastructure:**
- SSL certificate (HTTPS)
- Database with proper indexes
- Caching (OPcache, Laravel cache)
- Security hardening

---

### Next Steps

1. **Test thoroughly** - Go through all features
2. **Set up monitoring** - UptimeRobot or similar
3. **Configure backups** - Weekly database + file backups
4. **Update OAuth apps** - Add production redirect URIs
5. **Submit sitemap** - Google Search Console
6. **Set up analytics** - Google Analytics (optional)

---

### Getting Help

**Hostinger Support:**
- Live chat available 24/7
- Email: support@hostinger.com
- Knowledge base: https://support.hostinger.com

**Application Logs:**
```bash
tail -f ~/public_html/api/storage/logs/laravel.log
```

**Quick Commands Reference:**

```bash
# SSH Connection
ssh u123456789@yourdomain.com -p 65002

# Navigate to app
cd ~/public_html/api

# Clear all caches
php artisan cache:clear && php artisan config:cache && php artisan route:cache && php artisan view:cache

# Check logs
tail -50 storage/logs/laravel.log

# Run migrations
php artisan migrate --force

# Fix permissions
chmod -R 775 storage bootstrap/cache
```

---

**Congratulations! Your Resume Builder is now live! 🚀**

---

**Version:** 2.0  
**Last Updated:** January 10, 2026  
**Maintained by:** Suraj Sharma
