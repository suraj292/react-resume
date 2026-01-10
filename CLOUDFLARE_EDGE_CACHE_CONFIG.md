# Cloudflare Edge Cache Configuration

## Overview
This file contains Cloudflare Workers and Page Rules configuration for edge caching.

## Cloudflare Page Rules (Set in Cloudflare Dashboard)

### Rule 1: Cache Static Assets (Priority: 1)
**URL Pattern:** `resumebp.com/_next/static/*`
**Settings:**
- Cache Level: Cache Everything
- Edge Cache TTL: 1 year
- Browser Cache TTL: 1 year

### Rule 2: Cache Images (Priority: 2)
**URL Pattern:** `resumebp.com/*.{jpg,jpeg,png,gif,svg,webp,avif,ico}`
**Settings:**
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 month

### Rule 3: Cache Marketing Pages (Priority: 3)
**URL Pattern:** `resumebp.com/{pricing,about,contact,faq,ats-checker}`
**Settings:**
- Cache Level: Cache Everything
- Edge Cache TTL: 1 hour
- Browser Cache TTL: 5 minutes

### Rule 4: Cache API Responses (Priority: 4)
**URL Pattern:** `resumebp.com/api/{seo,pricing-plans,templates,blog}/*`
**Settings:**
- Cache Level: Cache Everything
- Edge Cache TTL: 30 minutes
- Browser Cache TTL: 5 minutes

### Rule 5: Bypass Cache for Auth (Priority: 5)
**URL Pattern:** `resumebp.com/api/auth/*`
**Settings:**
- Cache Level: Bypass

### Rule 6: Bypass Cache for User Data (Priority: 6)
**URL Pattern:** `resumebp.com/api/{resumes,user}/*`
**Settings:**
- Cache Level: Bypass

---

## Cloudflare Worker Script

Deploy this worker to handle advanced caching logic:

```javascript
// Cloudflare Worker for Advanced Edge Caching
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const cache = caches.default
  
  // Define cache rules
  const cacheRules = {
    // Static assets - 1 year
    '/_next/static/': { ttl: 31536000, browserTTL: 31536000 },
    
    // Images - 1 month
    '/images/': { ttl: 2592000, browserTTL: 2592000 },
    '/og-': { ttl: 604800, browserTTL: 604800 }, // OG images - 1 week
    
    // Marketing pages - 1 hour
    '/pricing': { ttl: 3600, browserTTL: 300 },
    '/about': { ttl: 3600, browserTTL: 300 },
    '/contact': { ttl: 3600, browserTTL: 300 },
    '/faq': { ttl: 3600, browserTTL: 300 },
    '/ats-checker': { ttl: 3600, browserTTL: 300 },
    
    // API endpoints
    '/api/seo/': { ttl: 86400, browserTTL: 3600 }, // 24h edge, 1h browser
    '/api/pricing-plans': { ttl: 1800, browserTTL: 300 }, // 30m edge, 5m browser
    '/api/templates': { ttl: 1800, browserTTL: 300 },
    '/api/blog/': { ttl: 300, browserTTL: 60 }, // 5m edge, 1m browser
  }
  
  // Check if request should be cached
  let cacheConfig = null
  for (const [pattern, config] of Object.entries(cacheRules)) {
    if (url.pathname.includes(pattern)) {
      cacheConfig = config
      break
    }
  }
  
  // Bypass cache for certain requests
  const bypassPatterns = ['/api/auth/', '/api/resumes/', '/api/user/', '/api/payments/']
  const shouldBypass = bypassPatterns.some(pattern => url.pathname.includes(pattern))
  
  if (shouldBypass || request.method !== 'GET') {
    return fetch(request)
  }
  
  // Try to get from cache
  let response = await cache.match(request)
  
  if (!response) {
    // Not in cache, fetch from origin
    response = await fetch(request)
    
    // Clone response for caching
    const responseToCache = response.clone()
    
    // Only cache successful responses
    if (response.ok && cacheConfig) {
      // Add cache headers
      const headers = new Headers(responseToCache.headers)
      headers.set('Cache-Control', `public, max-age=${cacheConfig.browserTTL}, s-maxage=${cacheConfig.ttl}`)
      headers.set('CDN-Cache-Control', `max-age=${cacheConfig.ttl}`)
      headers.set('X-Cache-Status', 'MISS')
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      // Store in cache
      event.waitUntil(cache.put(request, cachedResponse))
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      })
    }
    
    return response
  }
  
  // Return cached response with HIT header
  const headers = new Headers(response.headers)
  headers.set('X-Cache-Status', 'HIT')
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  })
}
```

---

## Cloudflare Cache Purge API

Use this to purge cache programmatically:

```bash
# Purge everything
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Purge specific URLs
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://resumebp.com/pricing","https://resumebp.com/api/pricing-plans"]}'

# Purge by tag
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"tags":["pricing","templates"]}'
```

---

## Setup Instructions

### 1. Enable Cloudflare for Domain
1. Add `resumebp.com` to Cloudflare
2. Update nameservers
3. Enable "Full (strict)" SSL/TLS mode

### 2. Configure Page Rules
1. Go to Cloudflare Dashboard → Rules → Page Rules
2. Create rules as specified above
3. Save and deploy

### 3. Deploy Worker (Optional)
1. Go to Workers & Pages
2. Create new Worker
3. Paste the worker script
4. Add route: `resumebp.com/*`
5. Deploy

### 4. Enable Caching Features
- ✅ Auto Minify (HTML, CSS, JS)
- ✅ Brotli compression
- ✅ Early Hints
- ✅ HTTP/2
- ✅ HTTP/3 (QUIC)

---

## Cache Headers Reference

```
Cache-Control: public, max-age=300, s-maxage=3600
├─ public: Can be cached by browsers and CDNs
├─ max-age=300: Browser caches for 5 minutes
└─ s-maxage=3600: CDN caches for 1 hour

CDN-Cache-Control: max-age=3600
└─ Cloudflare-specific cache duration

X-Cache-Status: HIT/MISS
└─ Indicates if response came from cache
```

---

## Monitoring

Check cache status in response headers:
```bash
curl -I https://resumebp.com/pricing
# Look for:
# X-Cache-Status: HIT
# CF-Cache-Status: HIT
# Age: 123
```

---

## Best Practices

1. **Static Assets:** Cache for 1 year (immutable)
2. **Marketing Pages:** Cache for 1 hour (edge), 5 minutes (browser)
3. **API Responses:** Cache for 30 minutes (edge), 5 minutes (browser)
4. **User Data:** Never cache (bypass)
5. **Auth Endpoints:** Never cache (bypass)

---

## Performance Impact

- **Edge Cache Hit:** ~10-50ms response time
- **Edge Cache Miss:** ~200-500ms (origin fetch)
- **Bandwidth Savings:** 70-90% reduction
- **Origin Load:** 80-95% reduction
