# Cloudflare CDN Setup & Optimization Guide

This guide covers the complete setup of Cloudflare CDN for the Resume Builder frontend, including caching strategies, performance optimizations, and security configurations.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Cloudflare Account Setup](#cloudflare-account-setup)
3. [DNS Configuration](#dns-configuration)
4. [Caching Strategy](#caching-strategy)
5. [Page Rules](#page-rules)
6. [Performance Optimizations](#performance-optimizations)
7. [Security Settings](#security-settings)
8. [Testing & Verification](#testing--verification)

---

## Prerequisites

- Domain name (e.g., `resumebp.com`)
- Cloudflare account (free tier is sufficient)
- VPS with Next.js app deployed
- SSL certificate (Cloudflare provides free SSL)

---

## Cloudflare Account Setup

### Step 1: Add Your Site to Cloudflare

1. **Sign up/Login** to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **"Add a Site"**
3. Enter your domain name: `resumebp.com`
4. Select the **Free Plan** (or higher if needed)
5. Click **"Add Site"**

### Step 2: Update Nameservers

Cloudflare will provide you with nameservers like:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

Update these at your domain registrar (e.g., GoDaddy, Namecheap, Hostinger):
1. Go to your domain registrar's DNS settings
2. Replace existing nameservers with Cloudflare's nameservers
3. Save changes (propagation takes 24-48 hours, usually faster)

---

## DNS Configuration

### Recommended DNS Records

In Cloudflare Dashboard → DNS → Records:

| Type  | Name | Content              | Proxy Status | TTL  |
|-------|------|----------------------|--------------|------|
| A     | @    | YOUR_VPS_IP          | Proxied ✅   | Auto |
| A     | www  | YOUR_VPS_IP          | Proxied ✅   | Auto |
| CNAME | *    | resumebp.com         | Proxied ✅   | Auto |

**Important:** 
- ✅ **Proxied (Orange Cloud)** = Traffic goes through Cloudflare CDN
- ⚪ **DNS Only (Gray Cloud)** = Direct connection to origin

For CDN benefits, keep records **Proxied**.

---

## Caching Strategy

Our Next.js middleware and config implement a multi-tier caching strategy:

### Cache Levels

#### 1. **Static Assets** (1 year)
- `/_next/static/*` - Next.js build files
- Images: `.jpg`, `.png`, `.svg`, `.webp`, `.ico`
- Fonts: `.woff`, `.woff2`, `.ttf`, `.eot`
- **Headers:**
  ```
  Cache-Control: public, max-age=31536000, immutable
  CDN-Cache-Control: public, max-age=31536000
  ```

#### 2. **Marketing Pages** (1 hour browser, 1 day CDN)
- `/` (homepage)
- `/pricing`
- `/contact`
- `/faq`
- `/ats-checker`
- **Headers:**
  ```
  Cache-Control: public, max-age=3600, stale-while-revalidate=86400
  CDN-Cache-Control: public, max-age=86400
  ```

#### 3. **Blog Pages** (30 min browser, 6 hours CDN)
- `/blog/*`
- **Headers:**
  ```
  Cache-Control: public, max-age=1800, stale-while-revalidate=21600
  CDN-Cache-Control: public, max-age=21600
  ```

#### 4. **Dynamic/Authenticated** (No cache)
- `/builder/*`
- `/dashboard/*`
- `/profile/*`
- `/api/*`
- `/login`, `/register`
- **Headers:**
  ```
  Cache-Control: private, no-cache, no-store, must-revalidate
  CDN-Cache-Control: no-store
  ```

### Cloudflare Cache Settings

Navigate to **Caching → Configuration**:

1. **Caching Level:** Standard
2. **Browser Cache TTL:** Respect Existing Headers
3. **Always Online:** ON (serves cached version if origin is down)
4. **Development Mode:** OFF (turn ON when testing to bypass cache)

---

## Page Rules

Create Page Rules in **Rules → Page Rules** for fine-grained control:

### Rule 1: Cache Static Assets
```
URL Pattern: *resumebp.com/_next/static/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 year
  - Browser Cache TTL: 1 year
```

### Rule 2: Cache Marketing Pages
```
URL Pattern: resumebp.com/
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 day
  - Browser Cache TTL: 1 hour
```

### Rule 3: Bypass Cache for Builder
```
URL Pattern: *resumebp.com/builder*
Settings:
  - Cache Level: Bypass
```

### Rule 4: Bypass Cache for API
```
URL Pattern: *resumebp.com/api/*
Settings:
  - Cache Level: Bypass
```

**Note:** Free plan allows 3 page rules. Prioritize the most important ones.

---

## Performance Optimizations

### 1. Auto Minify

Navigate to **Speed → Optimization → Content Optimization**:

- ✅ **JavaScript** - ON
- ✅ **CSS** - ON
- ✅ **HTML** - ON

### 2. Brotli Compression

Navigate to **Speed → Optimization → Content Optimization**:

- ✅ **Brotli** - ON (better compression than gzip)

### 3. Rocket Loader

Navigate to **Speed → Optimization → Content Optimization**:

- ⚠️ **Rocket Loader** - OFF (can break React apps, test carefully)

### 4. Early Hints

Navigate to **Speed → Optimization → Protocol Optimization**:

- ✅ **Early Hints** - ON (improves page load time)

### 5. HTTP/3 (QUIC)

Navigate to **Network**:

- ✅ **HTTP/3 (with QUIC)** - ON (faster protocol)
- ✅ **0-RTT Connection Resumption** - ON

### 6. Image Optimization

Navigate to **Speed → Optimization → Image Optimization**:

- ✅ **Polish** - Lossy (or Lossless if quality is critical)
- ✅ **WebP** - ON (serves WebP to supported browsers)
- ✅ **Mirage** - ON (lazy loads images)

**Note:** Some features require paid plans.

---

## Security Settings

### 1. SSL/TLS Configuration

Navigate to **SSL/TLS → Overview**:

- **Encryption Mode:** Full (Strict)
  - Requires valid SSL certificate on origin server
  - Most secure option

Navigate to **SSL/TLS → Edge Certificates**:

- ✅ **Always Use HTTPS** - ON
- ✅ **HTTP Strict Transport Security (HSTS)** - Enable
  - Max Age: 12 months
  - Include subdomains: ON
  - Preload: ON
- ✅ **Minimum TLS Version** - TLS 1.2
- ✅ **Opportunistic Encryption** - ON
- ✅ **TLS 1.3** - ON

### 2. Firewall Rules

Navigate to **Security → WAF**:

- ✅ **Web Application Firewall (WAF)** - ON
- **Managed Rules:** OWASP Core Ruleset - ON

### 3. Security Level

Navigate to **Security → Settings**:

- **Security Level:** Medium (or High if you experience attacks)
- ✅ **Challenge Passage** - 30 minutes
- ✅ **Browser Integrity Check** - ON

### 4. Bot Fight Mode

Navigate to **Security → Bots**:

- ✅ **Bot Fight Mode** - ON (free tier)
- Or **Super Bot Fight Mode** (paid plans)

### 5. DDoS Protection

Cloudflare provides automatic DDoS protection on all plans.

---

## Testing & Verification

### 1. Check DNS Propagation

```bash
# Check if DNS is pointing to Cloudflare
dig resumebp.com +short

# Check nameservers
dig resumebp.com NS +short
```

### 2. Test Cache Headers

```bash
# Test homepage caching
curl -I https://resumebp.com/

# Test static asset caching
curl -I https://resumebp.com/_next/static/css/app.css

# Look for these headers:
# - cf-cache-status: HIT (cached) or MISS (not cached)
# - cache-control: public, max-age=...
# - cf-ray: Cloudflare ray ID
```

### 3. Test SSL/TLS

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=resumebp.com

Should get **A+** rating with proper configuration.

### 4. Performance Testing

Use these tools:

- **PageSpeed Insights:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/
- **WebPageTest:** https://www.webpagetest.org/

Target metrics:
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s

### 5. Cache Hit Rate

Navigate to **Analytics → Caching** in Cloudflare Dashboard:

- Monitor **Cache Hit Rate** (aim for > 80%)
- Check **Bandwidth Saved**
- Review **Requests by Status Code**

---

## Cloudflare Cache Purging

### Purge All Cache

When deploying new version:

1. Go to **Caching → Configuration**
2. Click **"Purge Everything"**
3. Confirm

### Purge Specific Files

```bash
# Using Cloudflare API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://resumebp.com/","https://resumebp.com/pricing"]}'
```

### Purge by Tag (Enterprise only)

Our middleware doesn't set cache tags, but you can add them:

```typescript
response.headers.set('Cache-Tag', 'marketing,homepage');
```

---

## Development Mode

When testing changes:

1. Go to **Caching → Configuration**
2. Toggle **"Development Mode"** - ON
3. Cache is bypassed for 3 hours
4. Turn OFF when done testing

---

## Monitoring & Analytics

### Cloudflare Analytics

Navigate to **Analytics → Traffic**:

- Monitor requests, bandwidth, threats
- Check geographic distribution
- Review top URLs

### Real User Monitoring (RUM)

Navigate to **Speed → Optimization → Web Analytics**:

- Enable **Cloudflare Web Analytics** for free RUM
- Add JavaScript snippet to your site (optional)

---

## Troubleshooting

### Issue: Cache Not Working

**Check:**
1. Cloudflare proxy is enabled (orange cloud)
2. Page Rules are not conflicting
3. Response headers include `Cache-Control`
4. Development Mode is OFF

**Solution:**
```bash
# Check cache status
curl -I https://resumebp.com/ | grep cf-cache-status
```

### Issue: SSL Errors

**Check:**
1. SSL/TLS mode is "Full (Strict)"
2. Origin server has valid SSL certificate
3. Cloudflare SSL certificate is active

**Solution:**
- Wait 24 hours for SSL provisioning
- Or use "Full" mode temporarily (less secure)

### Issue: Slow Performance

**Check:**
1. Cache hit rate in Analytics
2. Image optimization is enabled
3. Minification is enabled
4. Origin server response time

**Solution:**
- Enable more aggressive caching
- Optimize origin server
- Use Cloudflare Workers for edge computing (advanced)

---

## Next.js Specific Considerations

### 1. Standalone Output

Our app uses `output: 'standalone'` which is compatible with Cloudflare.

### 2. Image Optimization

Next.js Image Optimization works with Cloudflare, but:
- Images are optimized on origin server
- Cloudflare caches optimized images
- Consider using Cloudflare Images (paid) for better performance

### 3. API Routes

API routes (`/api/*`) are NOT cached by default (as configured in middleware).

### 4. ISR/SSG

If using Incremental Static Regeneration:
- Set appropriate `revalidate` times
- Cloudflare will respect `s-maxage` in `Cache-Control`

---

## Cost Optimization

### Free Plan Limits

- Unlimited requests
- Unlimited bandwidth
- 3 Page Rules
- Basic DDoS protection
- Shared SSL certificate

### When to Upgrade

Consider **Pro Plan** ($20/month) if you need:
- More Page Rules (20 vs 3)
- Image Optimization (Polish, WebP)
- Mobile Optimization
- Better analytics

Consider **Business Plan** ($200/month) for:
- Custom SSL certificates
- Advanced DDoS protection
- PCI compliance
- 100% uptime SLA

---

## Summary Checklist

- [ ] Domain added to Cloudflare
- [ ] Nameservers updated
- [ ] DNS records configured (Proxied)
- [ ] SSL/TLS set to "Full (Strict)"
- [ ] Always Use HTTPS enabled
- [ ] HSTS enabled
- [ ] Auto Minify enabled (JS, CSS, HTML)
- [ ] Brotli compression enabled
- [ ] HTTP/3 enabled
- [ ] Page Rules created (if needed)
- [ ] WAF enabled
- [ ] Bot Fight Mode enabled
- [ ] Cache tested (cf-cache-status: HIT)
- [ ] SSL tested (A+ rating)
- [ ] Performance tested (PageSpeed > 90)

---

## Additional Resources

- [Cloudflare Docs](https://developers.cloudflare.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Cloudflare Cache Tutorial](https://developers.cloudflare.com/cache/)
- [Cloudflare Workers](https://workers.cloudflare.com/) (Advanced)

---

## Support

For issues or questions:
- Cloudflare Community: https://community.cloudflare.com/
- Cloudflare Support: https://support.cloudflare.com/

---

**Last Updated:** 2026-01-12
