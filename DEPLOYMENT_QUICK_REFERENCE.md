# 🚀 Quick Deployment Reference

## One-Command Deployment Preparation

```bash
./deploy-to-hostinger.sh
```

This script will:
1. ✅ Prepare backend (install dependencies, cache config)
2. ✅ Build frontend static export
3. ✅ Create deployment package with correct structure
4. ✅ Generate .htaccess files
5. ✅ Create tar.gz archive ready for upload

---

## Manual Build Commands

### Backend
```bash
cd resume-builder-backend
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend
```bash
cd resume-builder-frontend
npm install
npm run build
# Output: out/ directory
```

---

## Upload Structure

```
public_html/
├── index.html          ← from out/
├── _next/              ← from out/
├── *.html              ← from out/
├── api/                ← entire backend
│   ├── app/
│   ├── public/
│   ├── .env           ← UPDATE THIS!
│   └── ...
└── .htaccess          ← routing config
```

---

## SSH Quick Commands

```bash
# Connect
ssh username@yourdomain.com -p 65002

# Navigate
cd ~/public_html/api

# Migrations
php artisan migrate --force
php artisan db:seed --force

# Clear caches
php artisan cache:clear
php artisan config:clear

# Re-cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Permissions
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage

# Logs
tail -f storage/logs/laravel.log
```

---

## Environment Variables Checklist

### Backend (.env)
```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_pass
FRONTEND_URL=https://yourdomain.com
SESSION_DOMAIN=yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
REVALIDATE_SECRET=generate_with_openssl
```

### Frontend (.env.production.local)
```bash
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## OAuth Redirect URIs

Update in provider consoles:

- **Google:** `https://yourdomain.com/api/auth/google/callback`
- **LinkedIn:** `https://yourdomain.com/api/auth/linkedin/callback`
- **GitHub:** `https://yourdomain.com/api/auth/github/callback`

---

## Cron Job (cPanel)

```bash
* * * * * cd /home/username/public_html/api && php artisan schedule:run >> /dev/null 2>&1
```

---

## Testing Endpoints

```bash
# API Health
curl https://yourdomain.com/api/revalidate

# Pricing
curl https://yourdomain.com/api/pricing-plans

# Templates
curl https://yourdomain.com/api/templates
```

---

## Common Issues & Fixes

### 500 Error
```bash
chmod -R 755 storage bootstrap/cache
php artisan cache:clear
php artisan config:clear
```

### API 404
- Check .htaccess in root
- Verify mod_rewrite enabled
- Test: `yourdomain.com/api/public/index.php`

### Database Error
- Use `localhost` not `127.0.0.1`
- Check credentials in .env
- Verify database exists

### CORS Error
```bash
php artisan config:clear
php artisan config:cache
```

---

## File Permissions

```bash
# Directories
find . -type d -exec chmod 755 {} \;

# Files
find . -type f -exec chmod 644 {} \;

# Storage (writable)
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

---

## Backup Commands

```bash
# Database
mysqldump -u username -p database_name > backup.sql

# Files
tar -czf backup-$(date +%Y%m%d).tar.gz public_html/
```

---

## Update Process

### Backend Update
```bash
cd ~/public_html/api
git pull  # if using git
composer install --no-dev
php artisan migrate --force
php artisan cache:clear
php artisan config:cache
```

### Frontend Update
```bash
# Build locally
npm run build

# Upload out/* to public_html/
scp -r out/* user@host:~/public_html/
```

---

## Documentation

- 📖 **Full Guide:** `HOSTINGER_DEPLOYMENT_GUIDE.md`
- 📝 **Changes Summary:** `STATIC_EXPORT_CHANGES.md`
- 🔧 **Deployment Script:** `deploy-to-hostinger.sh`

---

## Support

- **Hostinger Docs:** https://support.hostinger.com
- **Laravel Docs:** https://laravel.com/docs
- **Next.js Static Export:** https://nextjs.org/docs/app/building-your-application/deploying/static-exports

---

**Quick Start:**
1. Run `./deploy-to-hostinger.sh`
2. Upload generated `.tar.gz` to Hostinger
3. Extract to `public_html/`
4. Update `.env` in `api/` directory
5. Run migrations via SSH
6. Test your site!

🎉 **You're ready to deploy!**
