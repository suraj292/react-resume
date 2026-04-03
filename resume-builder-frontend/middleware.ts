import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require an authenticated user.
// Note: Next.js middleware cannot read httpOnly cookies for Sanctum tokens stored
// in localStorage, so the primary auth guard lives in each page component /
// AuthContext. This middleware layer enforces:
//   1. Cache-control headers (existing)
//   2. A redirect to /login with `?redirect=<path>` for known protected paths
//      when there is NO auth_token cookie at all (lightweight first-pass guard).
const PROTECTED_PATHS = [
    '/builder',
    '/profile',
    '/my-resume',
    '/checkout',
    '/dashboard',
];

function isProtectedPath(pathname: string): boolean {
    return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Auth gating (first-pass, cookie-based) ────────────────────────────────
    // We set a non-httpOnly "auth_present" cookie on login so middleware can
    // detect authenticated sessions without exposing the real token.
    if (isProtectedPath(pathname)) {
        const authPresent = request.cookies.get('auth_present')?.value;

        if (!authPresent) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    const response = NextResponse.next();

    // ── Security Headers ──────────────────────────────────────────────────────
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );

    // ── Cache-Control per route class ─────────────────────────────────────────

    // Static assets — long-term immutable
    if (
        pathname.startsWith('/_next/static/') ||
        pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf|eot)$/)
    ) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
        response.headers.set('Cloudflare-CDN-Cache-Control', 'max-age=31536000');
        return response;
    }

    // JS/CSS bundles
    if (pathname.match(/\.(js|css)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
        return response;
    }

    // API proxy routes — no cache
    if (pathname.startsWith('/api/')) {
        response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        response.headers.set('CDN-Cache-Control', 'no-store');
        return response;
    }

    // Marketing / public pages
    if (
        pathname === '/' ||
        pathname.startsWith('/pricing') ||
        pathname.startsWith('/contact') ||
        pathname.startsWith('/faq') ||
        pathname.startsWith('/ats-checker')
    ) {
        response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        response.headers.set('CDN-Cache-Control', 'public, max-age=86400');
        response.headers.set('Cloudflare-CDN-Cache-Control', 'max-age=86400');
        return response;
    }

    // Blog
    if (pathname.startsWith('/blog')) {
        response.headers.set('Cache-Control', 'public, max-age=1800, stale-while-revalidate=21600');
        response.headers.set('CDN-Cache-Control', 'public, max-age=21600');
        response.headers.set('Cloudflare-CDN-Cache-Control', 'max-age=21600');
        return response;
    }

    // Protected / authenticated pages — never cache
    if (isProtectedPath(pathname)) {
        response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        response.headers.set('CDN-Cache-Control', 'no-store');
        return response;
    }

    // Auth pages — no cache
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        response.headers.set('CDN-Cache-Control', 'no-store');
        return response;
    }

    // Default
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    response.headers.set('CDN-Cache-Control', 'public, max-age=3600');

    return response;
}

export const config = {
    matcher: ['/((?!_next/image|_next/webpack-hmr|favicon.ico).*)'],
};
