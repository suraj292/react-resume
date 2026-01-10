/**
 * Next.js ISR Configuration
 * Implements Incremental Static Regeneration for marketing pages
 */

import { Metadata } from 'next';

// ============================================================================
// Revalidation Times (in seconds)
// ============================================================================

export const REVALIDATE_TIME = {
    STATIC: false,           // Never revalidate (truly static)
    HOURLY: 3600,           // 1 hour
    DAILY: 86400,           // 24 hours
    WEEKLY: 604800,         // 7 days
} as const;

// ============================================================================
// ISR Helper Functions
// ============================================================================

/**
 * Generate static params for dynamic routes
 * Used with generateStaticParams in app directory
 */
export async function generateBlogStaticParams() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts`, {
            next: { revalidate: REVALIDATE_TIME.HOURLY }
        });

        if (!response.ok) return [];

        const data = await response.json();
        const posts = data.data || [];

        return posts.map((post: any) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.error('Failed to generate blog static params:', error);
        return [];
    }
}

/**
 * Fetch data with ISR
 * Automatically revalidates based on specified time
 */
export async function fetchWithISR<T>(
    url: string,
    revalidate: number | false = REVALIDATE_TIME.HOURLY
): Promise<T> {
    const response = await fetch(url, {
        next: { revalidate },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch: ${url}`);
    }

    return response.json();
}

/**
 * Generate metadata with caching
 */
export async function generateCachedMetadata(
    route: string,
    revalidate: number = REVALIDATE_TIME.DAILY
): Promise<Metadata> {
    try {
        const seoData = await fetchWithISR<any>(
            `${process.env.NEXT_PUBLIC_API_URL}/seo/${route === '/' ? '%2F' : route.replace(/^\//, '')}`,
            revalidate
        );

        const data = seoData.data;

        return {
            title: data.meta_title || 'ResumeBP',
            description: data.meta_description || '',
            keywords: data.meta_keywords?.split(',').map((k: string) => k.trim()) || [],
            openGraph: {
                title: data.og_title || data.meta_title || '',
                description: data.og_description || data.meta_description || '',
                url: data.og_url || '',
                siteName: data.og_site_name || 'ResumeBP',
                images: data.og_image ? [{ url: data.og_image }] : [],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: data.twitter_title || data.og_title || '',
                description: data.twitter_description || data.og_description || '',
                images: data.twitter_image ? [data.twitter_image] : [],
                site: data.twitter_site || '@resumebp',
            },
            alternates: {
                canonical: data.canonical_url || '',
            },
            robots: {
                index: data.robots?.includes('index') ?? true,
                follow: data.robots?.includes('follow') ?? true,
            },
        };
    } catch (error) {
        console.error('Failed to generate metadata:', error);
        return {
            title: 'ResumeBP',
            description: 'AI-Powered Resume Builder',
        };
    }
}

// ============================================================================
// On-Demand Revalidation Helper
// ============================================================================

/**
 * Trigger on-demand revalidation
 * Call this from API routes or server actions
 */
export async function revalidatePath(path: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REVALIDATE_SECRET}`,
            },
            body: JSON.stringify({ path }),
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to revalidate path:', error);
        return false;
    }
}

/**
 * Revalidate multiple paths
 */
export async function revalidatePaths(paths: string[]): Promise<boolean[]> {
    return Promise.all(paths.map(path => revalidatePath(path)));
}

// ============================================================================
// Cache Tags (for granular revalidation)
// ============================================================================

export const CACHE_TAGS = {
    PRICING: 'pricing',
    TEMPLATES: 'templates',
    BLOG: 'blog',
    SEO: 'seo',
    CONTACT: 'contact',
} as const;

/**
 * Fetch with cache tags
 */
export async function fetchWithTags<T>(
    url: string,
    tags: string[],
    revalidate: number | false = REVALIDATE_TIME.HOURLY
): Promise<T> {
    const response = await fetch(url, {
        next: {
            revalidate,
            tags,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch: ${url}`);
    }

    return response.json();
}
