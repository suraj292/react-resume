import { Metadata } from 'next';
import { seoAPI, PageSeoData } from '@/lib/api';

/**
 * Generate metadata for a page based on route
 */
export async function generatePageMetadata(route: string, fallback?: Partial<Metadata>): Promise<Metadata> {
    try {
        const response = await seoAPI.getForRoute(route);

        if (!response.data.success) {
            return fallback || getDefaultMetadata();
        }

        const seo = response.data.data;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        return {
            title: seo.meta_title || fallback?.title || 'AI Resume Builder',
            description: seo.meta_description || (fallback?.description as string) || 'Create professional resumes with AI',
            keywords: seo.meta_keywords?.split(',').map(k => k.trim()) || [],

            robots: {
                index: seo.robots?.includes('index') ?? true,
                follow: seo.robots?.includes('follow') ?? true,
            },

            alternates: {
                canonical: seo.canonical_url || `${baseUrl}${route}`,
                languages: seo.alternate_languages || {},
            },

            openGraph: {
                title: seo.og_title || seo.meta_title || 'AI Resume Builder',
                description: seo.og_description || seo.meta_description || 'Create professional resumes',
                url: seo.og_url || `${baseUrl}${route}`,
                siteName: 'AI Resume Builder',
                images: seo.og_image ? [
                    {
                        url: seo.og_image,
                        width: 1200,
                        height: 630,
                        alt: seo.og_title || seo.meta_title || 'AI Resume Builder',
                    }
                ] : [],
                type: (seo.og_type as any) || 'website',
            },

            twitter: {
                card: (seo.twitter_card as any) || 'summary_large_image',
                title: seo.twitter_title || seo.og_title || seo.meta_title || 'AI Resume Builder',
                description: seo.twitter_description || seo.og_description || seo.meta_description || 'Create professional resumes',
                images: seo.twitter_image ? [seo.twitter_image] : (seo.og_image ? [seo.og_image] : []),
                site: seo.twitter_site || '@resumebuilder',
                creator: seo.twitter_creator || '@resumebuilder',
            },

            other: seo.schema_markup ? {
                'script:ld+json': typeof seo.schema_markup === 'string'
                    ? seo.schema_markup
                    : JSON.stringify(seo.schema_markup)
            } : {},
        };
    } catch (error) {
        console.error('Failed to fetch SEO metadata:', error);
        return fallback || getDefaultMetadata();
    }
}

/**
 * Get default metadata for pages without SEO data
 */
export function getDefaultMetadata(): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return {
        title: 'AI Resume Builder - Create Professional Resumes',
        description: 'Build your perfect resume with our AI-powered resume builder. Choose from professional templates and land your dream job faster.',
        keywords: ['resume builder', 'AI resume', 'professional resume', 'ATS resume', 'job application'],

        robots: {
            index: true,
            follow: true,
        },

        openGraph: {
            title: 'AI Resume Builder - Create Professional Resumes',
            description: 'Build your perfect resume with our AI-powered resume builder.',
            url: baseUrl,
            siteName: 'AI Resume Builder',
            type: 'website',
        },

        twitter: {
            card: 'summary_large_image',
            title: 'AI Resume Builder - Create Professional Resumes',
            description: 'Build your perfect resume with our AI-powered resume builder.',
            site: '@resumebuilder',
            creator: '@resumebuilder',
        },
    };
}

/**
 * Create metadata with custom overrides
 */
export function createMetadata(overrides: Partial<PageSeoData>, route: string = '/'): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return {
        title: overrides.meta_title || 'AI Resume Builder',
        description: overrides.meta_description || 'Create professional resumes with AI',
        keywords: overrides.meta_keywords?.split(',').map(k => k.trim()) || [],

        robots: {
            index: overrides.robots?.includes('index') ?? true,
            follow: overrides.robots?.includes('follow') ?? true,
        },

        alternates: {
            canonical: overrides.canonical_url || `${baseUrl}${route}`,
            languages: overrides.alternate_languages || {},
        },

        openGraph: {
            title: overrides.og_title || overrides.meta_title || 'AI Resume Builder',
            description: overrides.og_description || overrides.meta_description || 'Create professional resumes',
            url: overrides.og_url || `${baseUrl}${route}`,
            siteName: 'AI Resume Builder',
            images: overrides.og_image ? [
                {
                    url: overrides.og_image,
                    width: 1200,
                    height: 630,
                }
            ] : [],
            type: (overrides.og_type as any) || 'website',
        },

        twitter: {
            card: (overrides.twitter_card as any) || 'summary_large_image',
            title: overrides.twitter_title || overrides.og_title || 'AI Resume Builder',
            description: overrides.twitter_description || overrides.og_description || 'Create professional resumes',
            images: overrides.twitter_image ? [overrides.twitter_image] : [],
            site: overrides.twitter_site || '@resumebuilder',
            creator: overrides.twitter_creator || '@resumebuilder',
        },
    };
}
