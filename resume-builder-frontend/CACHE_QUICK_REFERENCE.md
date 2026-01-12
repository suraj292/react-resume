# Cloudflare + Next.js Caching - Quick Reference

Quick reference for cache configuration and common operations.

## 📊 Cache Duration Reference

### Browser Cache (Cache-Control: max-age)

| Content Type | Duration | Seconds | Use Case |
|-------------|----------|---------|----------|
| Static Assets | 1 year | 31536000 | Hashed files (immutable) |
| Marketing Pages | 1 hour | 3600 | Homepage, pricing, etc. |
| Blog Pages | 30 min | 1800 | Blog posts |
| Dynamic Pages | No cache | 0 | Builder, dashboard, auth |

### CDN Cache (CDN-Cache-Control)

| Content Type | Duration | Seconds | Use Case |
|-------------|----------|---------|----------|
| Static Assets | 1 year | 31536000 | Images, fonts, CSS, JS |
| Marketing Pages | 1 day | 86400 | Public pages |
| Blog Pages | 6 hours | 21600 | Blog content |
| Dynamic Pages | No cache | 0 | User-specific content |

### API Cache (In-Memory)

| Endpoint | Duration | Use Case |
|----------|----------|----------|
| SEO Data | 24 hours | Rarely changes |
| Templates | 30 min | Relatively static |
| Blog Posts | 5-30 min | Occasional updates |
| Pricing Plans | 30 min | Rarely changes |
| Currency Detection | 24 hours | User location |

### Storage Cache (localStorage)

| Data Type | Duration | Use Case |
|-----------|----------|----------|
| User Preferences | 1 week | Settings, theme |
| ATS Results | 1 hour | Analysis data |
| Pricing Plans | 1 day | Cached API response |
| Templates | 1 day | Template list |

---

## 🔧 Common Operations

### Purge Cloudflare Cache

**Purge Everything:**
```bash
# Via Dashboard
Caching → Configuration → Purge Everything

# Via API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

**Purge Specific URLs:**
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://resumebp.com/","https://resumebp.com/pricing"]}'
```

### Clear API Cache (Server-Side)

```typescript
import { apiCache } from '@/lib/api-cache';

// Clear all blog cache
apiCache.clear('blog:');

// Clear specific cache
apiCache.clear('pricing:plans');

// Clear everything
apiCache.clearAll();

// Get stats
const stats = apiCache.getStats();
console.log(stats); // { size: 15, keys: [...] }
```

### Clear Storage Cache (Client-Side)

```typescript
import { storageCache } from '@/lib/storage-cache';

// Clear specific key
storageCache.remove('pricing_plans');

// Clear all cache
storageCache.clear();

// Clean expired only
storageCache.cleanup();

// Get stats
const stats = storageCache.getStats();
console.log(stats); // { count: 5, totalSize: 12345, keys: [...] }
```

---

## 🧪 Testing Cache

### Check Cache Status

```bash
# Check if cached
curl -I https://resumebp.com/ | grep cf-cache-status
# HIT = Cached, MISS = Not cached, DYNAMIC = Bypassed

# Check cache headers
curl -I https://resumebp.com/ | grep -E "cache-control|cdn-cache-control"

# Check static asset
curl -I https://resumebp.com/_next/static/css/app.css | grep cf-cache-status
```

### Browser DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Reload page
4. Check **Size** column:
   - `(memory cache)` = Browser cache hit
   - `(disk cache)` = Browser cache hit
   - Actual size = Cache miss

### Cloudflare Analytics

1. Go to Cloudflare Dashboard
2. Navigate to **Analytics → Caching**
3. Check:
   - Cache Hit Rate (target: > 80%)
   - Bandwidth Saved
   - Requests by Cache Status

---

## 🎯 Cache Headers Quick Reference

### Static Assets (1 year, immutable)
```http
Cache-Control: public, max-age=31536000, immutable
CDN-Cache-Control: public, max-age=31536000
```

### Marketing Pages (1 hour browser, 1 day CDN, stale-while-revalidate)
```http
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
CDN-Cache-Control: public, max-age=86400
```

### Blog Pages (30 min browser, 6 hours CDN, stale-while-revalidate)
```http
Cache-Control: public, max-age=1800, stale-while-revalidate=21600
CDN-Cache-Control: public, max-age=21600
```

### Dynamic/Auth Pages (No cache)
```http
Cache-Control: private, no-cache, no-store, must-revalidate
CDN-Cache-Control: no-store
```

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `middleware.ts` | Route-based cache headers |
| `next.config.ts` | Next.js optimization config |
| `lib/api-cache.ts` | API response caching |
| `lib/storage-cache.ts` | Client-side storage caching |
| `lib/api.ts` | API client with caching |

---

## 🚨 Troubleshooting

### Cache Not Working

**Check:**
1. Cloudflare proxy enabled (orange cloud)
2. Development Mode OFF
3. Cache-Control headers present
4. Page Rules not conflicting

**Debug:**
```bash
curl -I https://resumebp.com/ | grep -E "cache|cloudflare"
```

### Stale Content

**Solution:**
1. Purge Cloudflare cache
2. Clear browser cache (Cmd+Shift+R)
3. Check TTL values

### localStorage Full

**Solution:**
```typescript
storageCache.cleanup(); // Remove expired entries
storageCache.clear(); // Remove all cache
```

---

## 📈 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Cache Hit Rate | > 80% | Check Analytics |
| PageSpeed Score | > 90 | Test regularly |
| LCP | < 2.5s | Monitor |
| FCP | < 1.8s | Monitor |
| TTI | < 3.8s | Monitor |

---

## 🔗 Quick Links

- [Full Cloudflare Setup Guide](./CLOUDFLARE_SETUP.md)
- [Detailed Caching Guide](./CACHING_GUIDE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**Last Updated:** 2026-01-12
