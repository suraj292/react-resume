'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { seoAPI, PageSeoData } from '@/lib/api';

/**
 * Custom hook to dynamically update page SEO
 * Use this in client components to inject SEO meta tags
 */
export function useSEO(fallbackTitle?: string, fallbackDescription?: string) {
    const pathname = usePathname();

    useEffect(() => {
        const updateSEO = async () => {
            try {
                const route = pathname || '/';
                console.log('[useSEO] Fetching SEO for route:', route);
                const response = await seoAPI.getForRoute(route);
                console.log('[useSEO] Response:', response.data);

                if (!response.data.success) {
                    // Use fallbacks
                    updateMetaTags({
                        meta_title: fallbackTitle || 'AI Resume Builder',
                        meta_description: fallbackDescription || 'Create professional resumes with AI',
                        meta_keywords: null,
                        og_title: null,
                        og_description: null,
                        og_image: null,
                        og_type: null,
                        og_url: null,
                        twitter_card: null,
                        twitter_title: null,
                        twitter_description: null,
                        twitter_image: null,
                        twitter_site: null,
                        twitter_creator: null,
                        canonical_url: null,
                        robots: null,
                        language: null,
                        alternate_languages: null,
                        schema_markup: null,
                    });
                    return;
                }

                const seo = response.data.data;
                updateMetaTags(seo);
            } catch (error) {
                console.error('Failed to fetch SEO data:', error);
                // Use fallbacks on error
                updateMetaTags({
                    meta_title: fallbackTitle || 'AI Resume Builder',
                    meta_description: fallbackDescription || 'Create professional resumes with AI',
                    meta_keywords: null,
                    og_title: null,
                    og_description: null,
                    og_image: null,
                    og_type: null,
                    og_url: null,
                    twitter_card: null,
                    twitter_title: null,
                    twitter_description: null,
                    twitter_image: null,
                    twitter_site: null,
                    twitter_creator: null,
                    canonical_url: null,
                    robots: null,
                    language: null,
                    alternate_languages: null,
                    schema_markup: null,
                });
            }
        };

        updateSEO();
    }, [pathname, fallbackTitle, fallbackDescription]);
}

/**
 * Update meta tags in the document head
 */
function updateMetaTags(seo: PageSeoData) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Update title
    if (seo.meta_title) {
        document.title = seo.meta_title;
    }

    // Update or create meta tags
    updateOrCreateMetaTag('name', 'description', seo.meta_description || '');
    updateOrCreateMetaTag('name', 'keywords', seo.meta_keywords || '');
    updateOrCreateMetaTag('name', 'robots', seo.robots || 'index, follow');

    // Open Graph
    updateOrCreateMetaTag('property', 'og:title', seo.og_title || seo.meta_title || '');
    updateOrCreateMetaTag('property', 'og:description', seo.og_description || seo.meta_description || '');
    updateOrCreateMetaTag('property', 'og:image', seo.og_image || '');
    updateOrCreateMetaTag('property', 'og:type', seo.og_type || 'website');
    updateOrCreateMetaTag('property', 'og:url', seo.og_url || window.location.href);

    // Twitter Card
    updateOrCreateMetaTag('name', 'twitter:card', seo.twitter_card || 'summary_large_image');
    updateOrCreateMetaTag('name', 'twitter:title', seo.twitter_title || seo.og_title || seo.meta_title || '');
    updateOrCreateMetaTag('name', 'twitter:description', seo.twitter_description || seo.og_description || seo.meta_description || '');
    updateOrCreateMetaTag('name', 'twitter:image', seo.twitter_image || seo.og_image || '');
    updateOrCreateMetaTag('name', 'twitter:site', seo.twitter_site || '@resumebuilder');
    updateOrCreateMetaTag('name', 'twitter:creator', seo.twitter_creator || '@resumebuilder');

    // Canonical URL
    updateOrCreateLinkTag('canonical', seo.canonical_url || window.location.href);

    // Schema Markup
    if (seo.schema_markup) {
        updateOrCreateSchemaScript(seo.schema_markup);
    }
}

/**
 * Helper to update or create meta tags
 */
function updateOrCreateMetaTag(attribute: 'name' | 'property', key: string, value: string) {
    if (!value) return;

    let element = document.querySelector(`meta[${attribute}="${key}"]`);

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }

    element.setAttribute('content', value);
}

/**
 * Helper to update or create link tags
 */
function updateOrCreateLinkTag(rel: string, href: string) {
    if (!href) return;

    let element = document.querySelector(`link[rel="${rel}"]`);

    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
    }

    element.setAttribute('href', href);
}

/**
 * Helper to update or create schema markup script
 */
function updateOrCreateSchemaScript(schema: any) {
    // Remove existing schema script
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
        existing.remove();
    }

    // Create new schema script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = typeof schema === 'string' ? schema : JSON.stringify(schema);
    document.head.appendChild(script);
}
