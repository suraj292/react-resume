# Multi-Layer Cache Setup Guide

## 🚀 Quick Start (5 Minutes)

Follow these steps to enable all 3 caching layers:

---

## Step 1: Laravel Backend Cache (2 minutes)

### 1.1 Register Middleware

Edit `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->api(append: [
        \App\Http\Middleware\CacheAPIResponse::class,
    ]);
})
```

### 1.2 Configure Cache Driver

Edit `.env`:

```env
CACHE_DRIVER=file  # or redis for production

# Optional: Cloudflare integration
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_API_TOKEN=your-api-token

# Optional: Next.js integration
NEXTJS_URL=http://localhost:3000
NEXTJS_REVALIDATE_SECRET=your-secret-key-here
```

### 1.3 Test Laravel Cache

```bash
# Make a request
curl http://localhost:8000/api/pricing-plans

# Check logs for cache status
tail -f storage/logs/laravel.log
# Should see: [Cache MISS] api/pricing-plans - cached for 1800s

# Make same request again
curl http://localhost:8000/api/pricing-plans
# Should see: [Cache HIT] api/pricing-plans
```

---

## Step 2: Next.js ISR Cache (2 minutes)

### 2.1 Add Environment Variable

Edit `.env.local`:

```env
REVALIDATE_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2.2 Test ISR Revalidation

```bash
# Test revalidation API
curl http://localhost:3000/api/revalidate
# Should return: {"status":"ok","message":"Revalidation API is running"}

# Trigger revalidation
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{"path":"/pricing"}'
# Should return: {"success":true,"message":"Revalidated path: /pricing"}
```

---

## Step 3: Cloudflare Edge Cache (1 minute)

### 3.1 Configure Page Rules (via Dashboard)

1. Go to Cloudflare Dashboard
2. Select your domain
3. Go to Rules → Page Rules
4. Add these rules (in order):

**Rule 1: Static Assets**
- URL: `resumebp.com/_next/static/*`
- Cache Level: Cache Everything
- Edge Cache TTL: 1 year

**Rule 2: Marketing Pages**
- URL: `resumebp.com/{pricing,about,contact,faq}`
- Cache Level: Cache Everything
- Edge Cache TTL: 1 hour

**Rule 3: API Responses**
- URL: `resumebp.com/api/{seo,pricing-plans,templates}/*`
- Cache Level: Cache Everything
- Edge Cache TTL: 30 minutes

---

## ✅ Verification

### Test All Layers

```bash
# 1. Test Laravel Cache
curl -I http://localhost:8000/api/pricing-plans
# Look for: X-Cache-Status: HIT

# 2. Test Next.js
curl -I http://localhost:3000/pricing
# Look for: X-Nextjs-Cache: HIT

# 3. Test Cloudflare (after deployment)
curl -I https://resumebp.com/pricing
# Look for: CF-Cache-Status: HIT
```

---

## 🎯 Cache Management Commands

### Laravel

```bash
# Clear cache by tag
php artisan cache:manage clear --tag=pricing

# Warm up cache
php artisan cache:manage warm

# View statistics
php artisan cache:manage stats

# Clear all cache
php artisan cache:clear
```

### Next.js

```bash
# Revalidate specific path
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-secret" \
  -d '{"path":"/pricing"}'

# Revalidate by tag
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-secret" \
  -d '{"tag":"pricing"}'

# Revalidate multiple paths
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-secret" \
  -d '{"paths":["/pricing","/about","/contact"]}'
```

### Cloudflare

```bash
# Purge everything
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -d '{"purge_everything":true}'

# Purge specific URLs
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -d '{"files":["https://resumebp.com/pricing"]}'
```

---

## 🐛 Troubleshooting

### Cache Not Working?

**Laravel:**
```bash
# Check cache driver
php artisan config:cache
php artisan cache:clear

# Check logs
tail -f storage/logs/laravel.log
```

**Next.js:**
```bash
# Rebuild
npm run build

# Check revalidation secret
echo $REVALIDATE_SECRET
```

**Cloudflare:**
- Check Page Rules are active
- Verify SSL/TLS mode is "Full (strict)"
- Check cache headers in response

---

## 📊 Monitoring

### Check Cache Hit Rates

**Laravel:**
```bash
php artisan cache:manage stats
```

**Next.js:**
Check build output for ISR pages:
```bash
npm run build
# Look for: ○ (Static) or ƒ (Dynamic)
```

**Cloudflare:**
Dashboard → Analytics → Caching

---

## 🎉 Success Criteria

After setup, you should see:

✅ **Laravel:** X-Cache-Status: HIT in API responses  
✅ **Next.js:** Fast page loads (< 100ms)  
✅ **Cloudflare:** CF-Cache-Status: HIT  
✅ **Overall:** 80-95% faster response times  

---

## 📝 Next Steps

1. **Monitor** cache hit rates for 1 week
2. **Adjust** TTLs based on data freshness needs
3. **Optimize** cache warming for critical paths
4. **Set up** automated cache invalidation on content updates
5. **Configure** Redis for production (better than file cache)

---

## 🆘 Need Help?

- Check `MULTI_LAYER_CACHE_ARCHITECTURE.md` for detailed docs
- Review logs in `storage/logs/laravel.log`
- Test with `curl -I` to see cache headers
- Use browser DevTools → Network tab

---

**Setup Time:** ~5 minutes  
**Performance Gain:** 80-95% faster  
**Difficulty:** Easy  

**You're all set! 🚀**
