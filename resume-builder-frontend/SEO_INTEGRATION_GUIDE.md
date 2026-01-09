# SEO Integration Guide

This guide explains how to integrate SEO meta tags into your Next.js pages using the centralized SEO management system.

## Overview

The SEO system consists of:
1. **Backend**: Filament admin panel to manage SEO data for all pages
2. **API**: Endpoints to fetch SEO data (`/api/seo/{route}`)
3. **Frontend**: Hooks and utilities to apply SEO meta tags dynamically

## For Client Components (Most Common)

Use the `useSEO` hook in any client component:

```typescript
'use client';

import { useSEO } from '@/hooks/useSEO';

export default function MyPage() {
    // Dynamic SEO - fetches from API based on current route
    useSEO(
        'Fallback Title',  // Used if API fails or no SEO data exists
        'Fallback Description'
    );

    return (
        <div>
            {/* Your page content */}
        </div>
    );
}
```

### Example: Home Page

```typescript
'use client';

import { useSEO } from '@/hooks/useSEO';

export default function HomePage() {
    useSEO(
        'AI Resume Builder - Create Professional Resumes',
        'Build your perfect resume with AI-powered tools'
    );

    return <div>Home Page Content</div>;
}
```

### Example: Pricing Page

```typescript
'use client';

import { useSEO } from '@/hooks/useSEO';

export default function PricingPage() {
    useSEO(
        'Pricing Plans - AI Resume Builder',
        'Choose the perfect plan for your needs'
    );

    return <div>Pricing Page Content</div>;
}
```

### Example: ATS Checker Page

```typescript
'use client';

import { useSEO } from '@/hooks/useSEO';

export default function ATSCheckerPage() {
    useSEO(
        'Free ATS Resume Checker',
        'Check if your resume is ATS-friendly'
    );

    return <div>ATS Checker Content</div>;
}
```

## For Server Components (App Router)

Use the `generatePageMetadata` function:

```typescript
import { generatePageMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata('/pricing', {
        title: 'Pricing - Fallback Title',
        description: 'Fallback description',
    });
}

export default function PricingPage() {
    return <div>Pricing Page Content</div>;
}
```

## Static Pages to Update

Based on `/lib/routes.ts`, here are all the static pages that need SEO integration:

### Marketing Pages
- ✅ **Home** (`/`) - Already updated
- ⏳ **Pricing** (`/pricing`)
- ⏳ **ATS Checker** (`/ats-checker`)
- ⏳ **Contact** (`/contact`)
- ⏳ **About** (`/about`)
- ⏳ **FAQ** (`/faq`)

### Legal Pages
- ⏳ **Privacy** (`/privacy`)
- ⏳ **Terms** (`/terms`)

### Dashboard Pages (Optional)
- ⏳ **Builder** (`/builder`)
- ⏳ **Profile** (`/profile`)
- ⏳ **My Resumes** (`/my-resume`)
- ⏳ **Checkout** (`/checkout`)

## Quick Implementation Template

For each page, add this at the top of the component:

```typescript
'use client';

import { useSEO } from '@/hooks/useSEO';

export default function YourPage() {
    useSEO(); // Will fetch SEO from API based on current route
    
    // OR with fallbacks:
    useSEO('Your Page Title', 'Your page description');

    return (
        // Your page content
    );
}
```

## Managing SEO in Admin Panel

1. Navigate to: `http://localhost:8000/superman`
2. Go to **Content Management** → **Pages SEO**
3. Click **Edit** on any page
4. Fill in the SEO fields across the tabs:
   - **Basic Meta**: Title, Description, Keywords
   - **Open Graph**: Social media preview
   - **Twitter Card**: Twitter-specific preview
   - **Technical SEO**: Canonical URL, robots, language
   - **Schema Markup**: JSON-LD structured data

## SEO Fields Explained

### Basic Meta
- **Meta Title**: 50-60 characters (shown in search results)
- **Meta Description**: 150-160 characters (shown in search results)
- **Meta Keywords**: Comma-separated keywords (optional)

### Open Graph
- **OG Title**: Title for social media shares
- **OG Description**: Description for social media
- **OG Image**: 1200x630px image for social previews
- **OG Type**: Usually "website" or "article"
- **OG URL**: Full URL of the page

### Twitter Card
- **Card Type**: "summary_large_image" recommended
- **Twitter Title**: Title for Twitter shares
- **Twitter Description**: Description for Twitter
- **Twitter Image**: 1200x675px image
- **Twitter Site**: Your brand's Twitter handle (@yourbrand)
- **Twitter Creator**: Content creator's handle

### Technical SEO
- **Canonical URL**: Preferred URL for this page
- **Robots**: "index, follow" (allow indexing) or "noindex, nofollow"
- **Language**: Page language code (en, es, fr, etc.)
- **Alternate Languages**: Other language versions

### Schema Markup
JSON-LD structured data for rich snippets:

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AI Resume Builder",
  "description": "Create professional resumes with AI",
  "url": "https://yoursite.com"
}
```

## API Endpoints

### Get SEO for a Route
```
GET /api/seo/{route}
```

Example:
```
GET /api/seo/pricing
GET /api/seo/  (for home page)
```

Response:
```json
{
  "success": true,
  "data": {
    "meta_title": "Pricing Plans - AI Resume Builder",
    "meta_description": "Choose the perfect plan...",
    "og_title": "Pricing Plans",
    "og_image": "/storage/seo/og-images/pricing.png",
    // ... all other SEO fields
  }
}
```

### Get All Published Pages
```
GET /api/seo
```

## Best Practices

1. **Always provide fallbacks**: In case API fails or SEO data doesn't exist
2. **Keep titles under 60 characters**: For optimal display in search results
3. **Keep descriptions under 160 characters**: For optimal display
4. **Use high-quality images**: 1200x630px for OG, 1200x675px for Twitter
5. **Test social previews**: Use Facebook Debugger and Twitter Card Validator
6. **Update schema markup**: For rich snippets in search results

## Testing

1. **View Source**: Right-click → View Page Source to see meta tags
2. **Browser DevTools**: Check `<head>` section for meta tags
3. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
5. **Google Rich Results Test**: https://search.google.com/test/rich-results

## Troubleshooting

### SEO not loading
- Check browser console for API errors
- Verify route exists in backend (`/api/seo/{route}`)
- Check if page is published in admin panel

### Meta tags not updating
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check if `useSEO` hook is called in component

### Social preview not showing
- Verify OG image URL is absolute (not relative)
- Check image dimensions (1200x630px recommended)
- Use Facebook Debugger to refresh cache

## Next Steps

1. Add `useSEO()` to all static pages listed above
2. Configure SEO data in admin panel for each page
3. Upload OG and Twitter images
4. Add schema markup for rich snippets
5. Test social previews
6. Monitor search console for indexing status
