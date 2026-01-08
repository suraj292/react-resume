'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { seoAPI, PageSeoData } from '@/lib/api';

interface SEOHeadProps {
    /**
     * Override SEO data (optional)
     * If provided, will use this instead of fetching from API
     */
    seoData?: Partial<PageSeoData>;

    /**
     * Fallback title if no SEO data is found
     */
    fallbackTitle?: string;

    /**
     * Fallback description if no SEO data is found
     */
    fallbackDescription?: string;
}

export default function SEOHead({ seoData: overrideSeoData, fallbackTitle, fallbackDescription }: SEOHeadProps) {
    const pathname = usePathname();
    const [seoData, setSeoData] = useState<PageSeoData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If override data is provided, use it
        if (overrideSeoData) {
            setSeoData(overrideSeoData as PageSeoData);
            setLoading(false);
            return;
        }

        // Fetch SEO data from API
        const fetchSeoData = async () => {
            try {
                const route = pathname || '/';
                const response = await seoAPI.getForRoute(route);

                if (response.data.success) {
                    setSeoData(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch SEO data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeoData();
    }, [pathname, overrideSeoData]);

    // Don't render anything while loading
    if (loading) return null;

    // Use SEO data or fallbacks
    const title = seoData?.meta_title || fallbackTitle || 'AI Resume Builder';
    const description = seoData?.meta_description || fallbackDescription || 'Create professional resumes with AI-powered tools';
    const keywords = seoData?.meta_keywords || '';
    const canonical = seoData?.canonical_url || `${process.env.NEXT_PUBLIC_APP_URL}${pathname}`;
    const robots = seoData?.robots || 'index, follow';
    const language = seoData?.language || 'en';

    // Open Graph
    const ogTitle = seoData?.og_title || title;
    const ogDescription = seoData?.og_description || description;
    const ogImage = seoData?.og_image || `${process.env.NEXT_PUBLIC_APP_URL}/og-default.png`;
    const ogType = seoData?.og_type || 'website';
    const ogUrl = seoData?.og_url || canonical;

    // Twitter Card
    const twitterCard = seoData?.twitter_card || 'summary_large_image';
    const twitterTitle = seoData?.twitter_title || ogTitle;
    const twitterDescription = seoData?.twitter_description || ogDescription;
    const twitterImage = seoData?.twitter_image || ogImage;
    const twitterSite = seoData?.twitter_site || '@resumebuilder';
    const twitterCreator = seoData?.twitter_creator || '@resumebuilder';

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={robots} />
            <meta httpEquiv="content-language" content={language} />
            <link rel="canonical" href={canonical} />

            {/* Alternate Languages */}
            {seoData?.alternate_languages && Object.entries(seoData.alternate_languages).map(([lang, url]) => (
                <link key={lang} rel="alternate" hrefLang={lang} href={url} />
            ))}

            {/* Open Graph Tags */}
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={ogUrl} />
            <meta property="og:site_name" content="AI Resume Builder" />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={twitterTitle} />
            <meta name="twitter:description" content={twitterDescription} />
            <meta name="twitter:image" content={twitterImage} />
            <meta name="twitter:site" content={twitterSite} />
            <meta name="twitter:creator" content={twitterCreator} />

            {/* Schema Markup */}
            {seoData?.schema_markup && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: typeof seoData.schema_markup === 'string'
                            ? seoData.schema_markup
                            : JSON.stringify(seoData.schema_markup)
                    }}
                />
            )}

            {/* Viewport and other essential meta tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
        </Head>
    );
}
