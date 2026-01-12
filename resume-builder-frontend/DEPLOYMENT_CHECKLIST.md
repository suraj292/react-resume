# Cloudflare + Next.js Deployment Checklist

Complete checklist for deploying the Resume Builder frontend with Cloudflare CDN optimization.

## 🚀 Pre-Deployment

### Code Preparation

- [ ] All features tested locally
- [ ] Production build successful (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Environment variables configured (`.env.production.local`)
- [ ] API endpoints point to production backend
- [ ] All console.logs removed (except errors/warnings)

### Performance Optimization

- [ ] Images optimized (WebP/AVIF format)
- [ ] Unused dependencies removed
- [ ] Bundle size analyzed (`npm run build` - check output)
- [ ] Lazy loading implemented for heavy components
- [ ] Code splitting configured (automatic with Next.js)

---

## 🌐 Cloudflare Setup

### Account & Domain

- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare
- [ ] Nameservers updated at registrar
- [ ] DNS propagation verified (24-48 hours)
- [ ] SSL certificate active (Cloudflare provides free SSL)

### DNS Configuration

- [ ] A record: `@` → VPS IP (Proxied ✅)
- [ ] A record: `www` → VPS IP (Proxied ✅)
- [ ] CNAME record: `*` → domain (Proxied ✅) - Optional
- [ ] All records set to "Proxied" (orange cloud)

### SSL/TLS Settings

Navigate to **SSL/TLS**:

- [ ] Encryption mode: **Full (Strict)**
- [ ] Always Use HTTPS: **ON**
- [ ] HSTS enabled:
  - [ ] Max Age: 12 months
  - [ ] Include subdomains: ON
  - [ ] Preload: ON
- [ ] Minimum TLS Version: **TLS 1.2**
- [ ] TLS 1.3: **ON**
- [ ] Opportunistic Encryption: **ON**

### Caching Configuration

Navigate to **Caching → Configuration**:

- [ ] Caching Level: **Standard**
- [ ] Browser Cache TTL: **Respect Existing Headers**
- [ ] Always Online: **ON**
- [ ] Development Mode: **OFF** (turn ON only when testing)

### Page Rules (Optional - Free plan: 3 rules)

Priority order:

1. [ ] **Rule 1:** Cache static assets
   - URL: `*yourdomain.com/_next/static/*`
   - Settings: Cache Everything, Edge TTL: 1 year

2. [ ] **Rule 2:** Bypass cache for builder
   - URL: `*yourdomain.com/builder*`
   - Settings: Cache Level: Bypass

3. [ ] **Rule 3:** Bypass cache for API
   - URL: `*yourdomain.com/api/*`
   - Settings: Cache Level: Bypass

### Performance Optimizations

Navigate to **Speed → Optimization**:

**Content Optimization:**
- [ ] Auto Minify - JavaScript: **ON**
- [ ] Auto Minify - CSS: **ON**
- [ ] Auto Minify - HTML: **ON**
- [ ] Brotli: **ON**
- [ ] Rocket Loader: **OFF** (can break React apps)

**Protocol Optimization:**
- [ ] Early Hints: **ON**
- [ ] HTTP/2 to Origin: **ON**

Navigate to **Network**:
- [ ] HTTP/3 (with QUIC): **ON**
- [ ] 0-RTT Connection Resumption: **ON**
- [ ] WebSockets: **ON**

**Image Optimization** (Paid plans only):
- [ ] Polish: Lossy (or Lossless)
- [ ] WebP: ON
- [ ] Mirage: ON

### Security Settings

Navigate to **Security → Settings**:

- [ ] Security Level: **Medium** (or High if needed)
- [ ] Challenge Passage: **30 minutes**
- [ ] Browser Integrity Check: **ON**
- [ ] Privacy Pass Support: **ON**

Navigate to **Security → WAF**:

- [ ] Web Application Firewall: **ON**
- [ ] OWASP Core Ruleset: **ON**

Navigate to **Security → Bots**:

- [ ] Bot Fight Mode: **ON** (free tier)
- [ ] Or Super Bot Fight Mode (paid plans)

### Firewall Rules (Optional)

Create rules to block malicious traffic:

- [ ] Block known bad bots
- [ ] Rate limiting for API endpoints
- [ ] Geo-blocking if needed

---

## 🖥️ VPS Server Setup

### Server Preparation

- [ ] VPS accessible via SSH
- [ ] Node.js installed (v18 or higher)
- [ ] npm/yarn installed
- [ ] PM2 installed globally (`npm install -g pm2`)
- [ ] Nginx installed and configured
- [ ] SSL certificate installed on origin server

### Deploy Application

```bash
# 1. Upload build to VPS
scp -r .next package.json package-lock.json user@vps:/var/www/resumebp

# 2. SSH into VPS
ssh user@vps

# 3. Install dependencies
cd /var/www/resumebp
npm install --production

# 4. Start with PM2
pm2 start npm --name "resumebp-frontend" -- start
pm2 save
pm2 startup
```

### Nginx Configuration

- [ ] Nginx config file created (`/etc/nginx/sites-available/resumebp.com`)
- [ ] Proxy pass to Next.js (port 3000)
- [ ] SSL certificate configured
- [ ] Gzip compression enabled
- [ ] Security headers set
- [ ] Config symlinked to sites-enabled
- [ ] Nginx reloaded (`sudo systemctl reload nginx`)

Example Nginx config:

```nginx
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
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

server {
    listen 80;
    server_name resumebp.com www.resumebp.com;
    return 301 https://$server_name$request_uri;
}
```

---

## ✅ Post-Deployment Verification

### DNS & SSL

- [ ] Domain resolves to Cloudflare IPs
  ```bash
  dig resumebp.com +short
  ```

- [ ] Nameservers are Cloudflare's
  ```bash
  dig resumebp.com NS +short
  ```

- [ ] HTTPS works without errors
  ```bash
  curl -I https://resumebp.com/
  ```

- [ ] SSL Labs test: **A+ rating**
  - Test: https://www.ssllabs.com/ssltest/

### Caching Verification

- [ ] Static assets cached (cf-cache-status: HIT)
  ```bash
  curl -I https://resumebp.com/_next/static/css/app.css | grep cf-cache-status
  ```

- [ ] Marketing pages cached
  ```bash
  curl -I https://resumebp.com/ | grep -E "cache-control|cf-cache-status"
  ```

- [ ] API routes NOT cached
  ```bash
  curl -I https://resumebp.com/api/test | grep cache-control
  # Should show: no-cache, no-store
  ```

- [ ] Cloudflare Analytics showing traffic
  - Dashboard → Analytics → Traffic

### Performance Testing

- [ ] PageSpeed Insights: **Score > 90**
  - Test: https://pagespeed.web.dev/

- [ ] GTmetrix: **Grade A**
  - Test: https://gtmetrix.com/

- [ ] WebPageTest: **All metrics green**
  - Test: https://www.webpagetest.org/

Target metrics:
- [ ] First Contentful Paint (FCP): < 1.8s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] Time to Interactive (TTI): < 3.8s
- [ ] Cumulative Layout Shift (CLS): < 0.1

### Functionality Testing

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Images load properly (check WebP/AVIF format)
- [ ] Forms submit successfully
- [ ] API calls work (check Network tab)
- [ ] Authentication works (login/register)
- [ ] Resume builder functions correctly
- [ ] PDF export works
- [ ] Blog pages load
- [ ] SEO meta tags present (view page source)

### Security Testing

- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Security headers present
  ```bash
  curl -I https://resumebp.com/ | grep -E "X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security"
  ```

- [ ] No sensitive data in client-side code
- [ ] API keys not exposed in frontend
- [ ] CORS configured correctly
- [ ] Rate limiting working (if implemented)

### Mobile Testing

- [ ] Responsive design works on mobile
- [ ] Touch interactions work
- [ ] Mobile PageSpeed score > 80
- [ ] No horizontal scrolling
- [ ] Buttons/links easily tappable

---

## 📊 Monitoring Setup

### Cloudflare Analytics

- [ ] Web Analytics enabled
  - Navigate to: Speed → Optimization → Web Analytics
  - Add JavaScript snippet (optional)

- [ ] Email alerts configured
  - Navigate to: Notifications
  - Set up alerts for:
    - [ ] Traffic anomalies
    - [ ] DDoS attacks
    - [ ] SSL certificate expiration
    - [ ] Origin server errors

### Application Monitoring

- [ ] PM2 monitoring active
  ```bash
  pm2 monit
  ```

- [ ] Server logs configured
  ```bash
  pm2 logs resumebp-frontend
  ```

- [ ] Error tracking setup (e.g., Sentry) - Optional
- [ ] Uptime monitoring (e.g., UptimeRobot) - Optional

### Performance Monitoring

- [ ] Cloudflare Analytics reviewed weekly
  - Cache hit rate (target: > 80%)
  - Bandwidth saved
  - Request distribution

- [ ] Server resource usage monitored
  ```bash
  htop
  df -h
  ```

---

## 🔄 Maintenance Procedures

### Regular Tasks

**Weekly:**
- [ ] Check Cloudflare Analytics
- [ ] Review error logs
- [ ] Monitor cache hit rate
- [ ] Check SSL certificate expiration

**Monthly:**
- [ ] Run performance tests
- [ ] Review and optimize bundle size
- [ ] Update dependencies
- [ ] Backup configuration files

**After Each Deployment:**
- [ ] Purge Cloudflare cache
  - Dashboard → Caching → Configuration → Purge Everything
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics

### Cache Purging

**Purge all cache:**
```bash
# Via Cloudflare Dashboard
Caching → Configuration → Purge Everything

# Or via API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

**Purge specific URLs:**
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://resumebp.com/","https://resumebp.com/pricing"]}'
```

---

## 🐛 Troubleshooting

### Issue: Site Not Loading

**Check:**
- [ ] DNS propagation complete
- [ ] Cloudflare proxy enabled (orange cloud)
- [ ] Origin server running (`pm2 status`)
- [ ] Nginx running (`sudo systemctl status nginx`)
- [ ] Firewall not blocking traffic

### Issue: SSL Errors

**Check:**
- [ ] SSL/TLS mode is "Full (Strict)"
- [ ] Origin server has valid SSL certificate
- [ ] Certificate not expired
- [ ] Cloudflare SSL certificate active (wait 24 hours)

**Temporary fix:**
- Change SSL/TLS mode to "Full" (less secure)

### Issue: Cache Not Working

**Check:**
- [ ] Development Mode is OFF
- [ ] Cache-Control headers present in response
- [ ] Page Rules not conflicting
- [ ] Cloudflare proxy enabled

**Debug:**
```bash
curl -I https://resumebp.com/ | grep -E "cache-control|cf-cache-status"
```

### Issue: Slow Performance

**Check:**
- [ ] Cache hit rate in Analytics (should be > 80%)
- [ ] Origin server response time
- [ ] Image optimization enabled
- [ ] Minification enabled
- [ ] Brotli compression enabled

**Solutions:**
- Enable more aggressive caching
- Optimize images
- Reduce bundle size
- Enable Cloudflare features (Polish, Mirage)

### Issue: 502 Bad Gateway

**Check:**
- [ ] Next.js app running (`pm2 status`)
- [ ] Nginx proxy_pass correct
- [ ] Port 3000 accessible
- [ ] Firewall rules

**Fix:**
```bash
pm2 restart resumebp-frontend
sudo systemctl restart nginx
```

---

## 📚 Additional Resources

- [Cloudflare Setup Guide](./CLOUDFLARE_SETUP.md)
- [Caching Optimization Guide](./CACHING_GUIDE.md)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Cloudflare Docs](https://developers.cloudflare.com/)

---

## ✨ Success Criteria

Your deployment is successful when:

- ✅ Site loads over HTTPS without errors
- ✅ SSL Labs rating: A+
- ✅ PageSpeed score: > 90 (desktop), > 80 (mobile)
- ✅ Cache hit rate: > 80%
- ✅ All features working correctly
- ✅ No console errors
- ✅ Security headers present
- ✅ Monitoring active

---

**Last Updated:** 2026-01-12
