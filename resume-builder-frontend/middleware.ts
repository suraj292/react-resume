import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;

    // ============================================================================
    // Security Headers (Applied to all routes)
    // ============================================================================

    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Strict Transport Security (HSTS) - 1 year
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );

    // ============================================================================
    // Cloudflare Cache Control Headers
    // ============================================================================

    // Static Assets - Long-term caching (1 year)
    if (
        pathname.startsWith('/_next/static/') ||
        pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf|eot)$/)
    ) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        );
        response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
        response.headers.set('Cloudflare-CDN-Cache-Control', 'max-age=31536000');
        return response;
    }

    // JavaScript and CSS bundles - Long-term caching with revalidation
    if (pathname.match(/\.(js|css)$/)) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        );
        response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
        return response;
    }

    // API Routes - No caching (dynamic content)
    if (pathname.startsWith('/api/')) {
        response.headers.set(
            'Cache-Control',
            'private, no-cache, no-store, must-revalidate'
        );
        response.headers.set('CDN-Cache-Control', 'no-store');
        return response;
    }

    // Marketing Pages - Medium-term caching (1 hour browser, 1 day CDN)
    if (
        pathname === '/' ||
        pathname.startsWith('/pricing') ||
        pathname.startsWith('/contact') ||
        pathname.startsWith('/faq') ||
        pathname.startsWith('/ats-checker')
    ) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=3600, stale-while-revalidate=86400'
        );
        response.headers.set('CDN-Cache-Control', 'public, max-age=86400');
        response.headers.set('Cloudflare-CDN-Cache-Control', 'max-age=86400');
        return response;
    }

    // Blog Pages - Medium-term caching (30 min browser, 6 hours CDN)
    if (pathname.startsWith('/blog')) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=1800, stale-while-revalidate=21600'
        );
        response.headers.set('CDN-Cache-Control', 'public, max-age=21600');
        response.headers.set('Cloudflare-CDN-Cache-Control', 'max-age=21600');
        return response;
    }

    // Builder/Dashboard - No caching (authenticated, dynamic)
    if (
        pathname.startsWith('/builder') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/profile')
    ) {
        response.headers.set(
            'Cache-Control',
            'private, no-cache, no-store, must-revalidate'
        );
        response.headers.set('CDN-Cache-Control', 'no-store');
        return response;
    }

    // Auth Pages - No caching
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        response.headers.set(
            'Cache-Control',
            'private, no-cache, no-store, must-revalidate'
        );
        response.headers.set('CDN-Cache-Control', 'no-store');
        return response;
    }

    // Default - Short-term caching (5 min browser, 1 hour CDN)
    response.headers.set(
        'Cache-Control',
        'public, max-age=300, stale-while-revalidate=3600'
    );
    response.headers.set('CDN-Cache-Control', 'public, max-age=3600');

    return response;
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/image (image optimization files)
         * - _next/webpack-hmr (hot module replacement)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/image|_next/webpack-hmr|favicon.ico).*)',
    ],
};
