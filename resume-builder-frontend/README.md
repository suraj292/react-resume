# Resume Builder - Frontend

A high-performance Next.js application for creating professional resumes with AI-powered features, built with Cloudflare CDN optimization and multi-layer caching.

## 🚀 Features

- **Resume Builder:** Drag-and-drop interface with real-time preview
- **AI Assistant:** AI-powered content suggestions and ATS optimization
- **Template Library:** Professional resume templates with customization
- **ATS Checker:** Analyze resume compatibility with ATS systems
- **Blog System:** Dynamic blog with SEO optimization
- **Authentication:** Social login (Google, LinkedIn, GitHub) + email/password
- **Pricing Plans:** Flexible pricing with coupon support
- **PDF Export:** High-quality PDF generation
- **Multi-language Support:** Internationalization ready

## ⚡ Performance Optimizations

### Multi-Layer Caching Architecture

- **Layer 1:** Browser cache (1 year for static assets)
- **Layer 2:** Cloudflare CDN edge cache (global distribution)
- **Layer 3:** API response cache (in-memory)
- **Layer 4:** Client storage cache (localStorage)

**Expected Performance:**
- 60-70% faster page loads
- 70% reduction in server load
- 80%+ cache hit rate
- PageSpeed score > 90

### Technologies

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **Data Fetching:** React Query
- **Forms:** React Hook Form + Zod
- **PDF Generation:** @react-pdf/renderer
- **Animations:** Framer Motion
- **CDN:** Cloudflare

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Backend API running (Laravel)

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production, create `.env.production.local`:

```env
NEXT_PUBLIC_API_URL=https://api.resumebp.com/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
resume-builder-frontend/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/       # Public pages (home, pricing, blog)
│   ├── builder/           # Resume builder app
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── resume-builder/   # Builder-specific components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and libraries
│   ├── api.ts            # API client with caching
│   ├── api-cache.ts      # API response cache
│   └── storage-cache.ts  # Client-side storage cache
├── middleware.ts          # Cache control & security headers
├── next.config.ts         # Next.js configuration
└── public/               # Static assets
```

## 🌐 Cloudflare Setup

This application is optimized for Cloudflare CDN. See comprehensive guides:

- **[Cloudflare Setup Guide](./CLOUDFLARE_SETUP.md)** - Complete setup instructions
- **[Caching Guide](./CACHING_GUIDE.md)** - Technical caching details
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Deployment workflow
- **[Quick Reference](./CACHE_QUICK_REFERENCE.md)** - Common operations

### Quick Cloudflare Setup

1. Add domain to Cloudflare
2. Update nameservers
3. Configure DNS (A records pointing to VPS)
4. Enable SSL/TLS (Full Strict mode)
5. Configure caching and security settings
6. Deploy application to VPS

See [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) for detailed instructions.

## 📊 Caching Strategy

### Static Assets (1 year)
- `/_next/static/*` - Build files
- Images, fonts, CSS, JS

### Marketing Pages (1 hour browser, 1 day CDN)
- Homepage, pricing, contact, FAQ

### Blog Pages (30 min browser, 6 hours CDN)
- All blog content

### Dynamic Pages (No cache)
- Builder, dashboard, profile, API routes

See [CACHING_GUIDE.md](./CACHING_GUIDE.md) for complete details.

## 🔐 Security

All routes include security headers:

- HSTS (HTTP Strict Transport Security)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Referrer-Policy
- Permissions-Policy

Cloudflare provides additional security:

- WAF (Web Application Firewall)
- DDoS protection
- Bot protection
- Free SSL/TLS

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Check TypeScript

```bash
npx tsc --noEmit
```

### Performance Testing

- **PageSpeed Insights:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/
- **WebPageTest:** https://www.webpagetest.org/

### Cache Testing

```bash
# Check cache status
curl -I https://resumebp.com/ | grep cf-cache-status

# Check cache headers
curl -I https://resumebp.com/ | grep cache-control
```

## 📚 Documentation

- **[Cloudflare Optimization Summary](./CLOUDFLARE_OPTIMIZATION_SUMMARY.md)** - Overview of all optimizations
- **[Cloudflare Setup Guide](./CLOUDFLARE_SETUP.md)** - Complete Cloudflare setup
- **[Caching Guide](./CACHING_GUIDE.md)** - Technical caching documentation
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Deployment workflow
- **[Cache Quick Reference](./CACHE_QUICK_REFERENCE.md)** - Quick reference guide
- **[Routes Guide](./ROUTES_GUIDE.md)** - Application routes
- **[SEO Guide](./SEO_INTEGRATION_GUIDE.md)** - SEO implementation

## 🚀 Deployment

### VPS Deployment (Recommended)

1. Build the application:
   ```bash
   npm run build
   ```

2. Upload to VPS:
   ```bash
   scp -r .next package.json package-lock.json user@vps:/var/www/resumebp
   ```

3. Install and start:
   ```bash
   ssh user@vps
   cd /var/www/resumebp
   npm install --production
   pm2 start npm --name "resumebp-frontend" -- start
   ```

4. Configure Nginx as reverse proxy

5. Setup Cloudflare (see [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md))

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete workflow.

### Vercel Deployment (Alternative)

```bash
vercel deploy
```

Note: Cloudflare optimizations work best with VPS deployment.

## 🔧 Configuration

### Next.js Config

Key configurations in `next.config.ts`:

- **Output:** Standalone (for VPS deployment)
- **Image Optimization:** AVIF/WebP support
- **Compression:** Brotli enabled
- **Security:** Powered-by header disabled
- **Turbopack:** Enabled (Next.js 16+)

### Middleware

`middleware.ts` handles:

- Route-based cache headers
- Security headers
- Cloudflare CDN optimization

## 📈 Performance Metrics

### Targets

- **PageSpeed Score:** > 90 (desktop), > 80 (mobile)
- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.8s
- **Cache Hit Rate:** > 80%

### Monitoring

- Cloudflare Analytics (cache hit rate, bandwidth)
- PageSpeed Insights (performance scores)
- Server logs (PM2)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues or questions:

- Check documentation in this repository
- Review [troubleshooting guides](./DEPLOYMENT_CHECKLIST.md#troubleshooting)
- Contact development team

## 🔗 Related Projects

- **Backend:** Laravel API (resume-builder-backend)
- **Admin Panel:** Filament admin dashboard

---

**Last Updated:** 2026-01-12  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

