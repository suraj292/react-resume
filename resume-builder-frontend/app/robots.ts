import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration
 * Controls search engine crawler access to your site
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/builder',      // Protected: Resume builder (requires auth)
                    '/profile',      // Protected: User profile
                    '/my-resumes',   // Protected: User's resumes
                    '/checkout',     // Protected: Checkout page
                    '/api/',         // API routes
                    '/_next/',       // Next.js internal files
                ],
            },
            {
                userAgent: 'GPTBot', // OpenAI's crawler
                disallow: ['/'], // Block AI training on content
            },
            {
                userAgent: 'ChatGPT-User',
                disallow: ['/'],
            },
            {
                userAgent: 'CCBot', // Common Crawl
                disallow: ['/'],
            },
            {
                userAgent: 'anthropic-ai',
                disallow: ['/'],
            },
            {
                userAgent: 'Claude-Web',
                disallow: ['/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
