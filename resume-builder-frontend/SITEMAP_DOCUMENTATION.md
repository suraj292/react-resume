# Sitemap & SEO Configuration

This document explains the dynamic sitemap and robots.txt configuration for the AI Resume Builder application.

## Overview

The application uses Next.js 13+ App Router's built-in sitemap and robots.txt generation features to create dynamic, SEO-optimized files.

## Files Created

### 1. `/app/sitemap.ts`
Dynamic sitemap generator that includes:
- **Static Routes**: All public marketing and legal pages
- **Dynamic Routes**: Blog posts fetched from the backend API
- **SEO Metadata**: Priority, change frequency, and last modified dates

### 2. `/app/robots.ts`
Robots.txt configuration that:
- Allows search engine crawlers to index public pages
- Blocks protected/authenticated routes
- Blocks AI training crawlers (GPTBot, Claude, etc.)
- References the sitemap.xml location

## Sitemap Structure

### Static Routes (11 pages)

| Route | Priority | Change Frequency | Description |
|-------|----------|------------------|-------------|
| `/` | 1.0 | daily | Home page (highest priority) |
| `/pricing` | 0.9 | weekly | Pricing plans |
| `/ats-checker` | 0.9 | weekly | ATS resume checker |
| `/faq` | 0.8 | weekly | Frequently asked questions |
| `/blog` | 0.8 | daily | Blog listing page |
| `/contact` | 0.7 | monthly | Contact page |
| `/about` | 0.7 | monthly | About page |
| `/privacy` | 0.5 | yearly | Privacy policy |
| `/terms` | 0.5 | yearly | Terms of service |
| `/refund-policy` | 0.5 | yearly | Refund & cancellation policy |
| `/shipping-policy` | 0.5 | yearly | Shipping & delivery policy |

### Dynamic Routes

**Blog Posts**: Automatically fetched from `/api/blog/posts`
- Priority: 0.7
- Change Frequency: monthly
- Last Modified: Uses post's `updated_at` or `published_at` timestamp

## Robots.txt Configuration

### Allowed Routes
All public routes are allowed for search engine crawlers:
- Marketing pages (home, pricing, ATS checker, etc.)
- Blog pages
- Legal pages (privacy, terms, etc.)

### Blocked Routes
Protected routes are blocked from indexing:
- `/builder` - Resume builder (requires authentication)
- `/profile` - User profile
- `/my-resume` - User's saved resumes
- `/checkout` - Checkout page
- `/api/*` - API endpoints
- `/_next/*` - Next.js internal files

### AI Crawler Protection
The following AI training crawlers are explicitly blocked:
- `GPTBot` (OpenAI)
- `ChatGPT-User` (OpenAI)
- `CCBot` (Common Crawl)
- `anthropic-ai` (Anthropic/Claude)
- `Claude-Web` (Anthropic)

This prevents AI companies from training their models on your content.

## How It Works

### Sitemap Generation

1. **Static Routes**: Defined in the sitemap with fixed priorities
2. **Dynamic Routes**: Fetched from backend API at build/request time
3. **XML Generation**: Next.js automatically converts the TypeScript to valid XML
4. **Caching**: Next.js caches the sitemap for performance

### Accessing the Files

- **Sitemap**: `https://yourdomain.com/sitemap.xml`
- **Robots**: `https://yourdomain.com/robots.txt`

## Testing Locally

```bash
# View sitemap
curl http://localhost:3000/sitemap.xml

# View robots.txt
curl http://localhost:3000/robots.txt
```

Or open in browser:
- http://localhost:3000/sitemap.xml
- http://localhost:3000/robots.txt

## Verification Results

✅ **Sitemap.xml**: 14 URLs total
- 11 static pages
- 3 dynamic blog posts
- Valid XML structure
- Proper SEO metadata

✅ **Robots.txt**: Correctly configured
- Search engines allowed on public pages
- Protected routes blocked
- AI crawlers blocked
- Sitemap reference included

## Submitting to Search Engines

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add your property (domain)
3. Navigate to "Sitemaps" in the left menu
4. Submit: `https://yourdomain.com/sitemap.xml`

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add your site
3. Navigate to "Sitemaps"
4. Submit: `https://yourdomain.com/sitemap.xml`

## Updating the Sitemap

### Adding New Static Pages
Edit `/app/sitemap.ts` and add the new route to the `staticRoutes` array:

```typescript
{
    url: `${BASE_URL}/new-page`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
}
```

### Dynamic Content
Blog posts are automatically included when published in the backend. No manual updates needed.

## Best Practices

1. **Priority Values**:
   - 1.0: Homepage only
   - 0.8-0.9: Important pages (pricing, main features)
   - 0.6-0.7: Secondary pages (contact, about)
   - 0.4-0.5: Legal pages (privacy, terms)

2. **Change Frequency**:
   - `always`: Real-time data (rarely used)
   - `hourly`: Very frequently updated
   - `daily`: News, blog listing
   - `weekly`: Product pages, features
   - `monthly`: Static content
   - `yearly`: Legal documents

3. **Last Modified**:
   - Use actual update dates for dynamic content
   - Use `new Date()` for static pages

## Monitoring

### Check Sitemap Health
- Google Search Console: Coverage report
- Bing Webmaster Tools: Sitemap report
- Manual validation: https://www.xml-sitemaps.com/validate-xml-sitemap.html

### Common Issues
- **404 errors**: Ensure all URLs in sitemap are accessible
- **Redirect chains**: Fix redirects before adding to sitemap
- **Blocked by robots.txt**: Ensure sitemap URLs aren't blocked

## Environment Variables

The sitemap uses these environment variables:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

Make sure these are set correctly in production.

## Production Deployment

When deploying to production:

1. ✅ Set `NEXT_PUBLIC_APP_URL` to your production domain
2. ✅ Verify sitemap.xml loads correctly
3. ✅ Verify robots.txt loads correctly
4. ✅ Submit sitemap to Google Search Console
5. ✅ Submit sitemap to Bing Webmaster Tools
6. ✅ Monitor indexing status

## Additional Resources

- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js Robots.txt Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Robots.txt Specification](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
