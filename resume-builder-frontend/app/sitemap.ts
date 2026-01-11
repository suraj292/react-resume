import { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/routes';
import axios from 'axios';

// Force dynamic rendering for standalone build
export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Dynamic sitemap generation for Next.js App Router
 * Includes static pages and dynamic blog posts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes with their priorities and change frequencies
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}${ROUTES.HOME}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}${ROUTES.PRICING}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}${ROUTES.ATS_CHECKER}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}${ROUTES.CONTACT}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}${ROUTES.ABOUT}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}${ROUTES.FAQ}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}${ROUTES.BLOG}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}${ROUTES.PRIVACY}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}${ROUTES.TERMS}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}${ROUTES.REFUND}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}${ROUTES.SHIPPING}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];

    // Fetch dynamic blog posts from the backend
    let blogPosts: MetadataRoute.Sitemap = [];
    try {
        const response = await axios.get(`${API_URL}/blog/posts`, {
            params: {
                status: 'published',
                per_page: 1000, // Get all published posts
            },
        });

        if (response.data && Array.isArray(response.data.data)) {
            blogPosts = response.data.data.map((post: any) => ({
                url: `${BASE_URL}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at || post.published_at),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
            }));
        }
    } catch (error) {
        console.error('Error fetching blog posts for sitemap:', error);
        // Continue without blog posts if API fails
    }

    // Combine all routes
    return [...staticRoutes, ...blogPosts];
}
