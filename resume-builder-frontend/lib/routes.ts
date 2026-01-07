/**
 * Centralized Route Management
 * 
 * All application routes are defined here for easy management and type safety.
 * Import and use these route helpers throughout the application instead of hardcoded strings.
 */

// ============================================================================
// Route Definitions
// ============================================================================

export const ROUTES = {
    // Public Routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/login?tab=register',

    // Marketing Pages
    PRICING: '/pricing',
    ATS_CHECKER: '/ats-checker',
    CONTACT: '/contact',
    ABOUT: '/about',
    BLOG: '/blog',
    FAQ: '/faq',

    // Legal Pages
    PRIVACY: '/privacy',
    TERMS: '/terms',

    // Dashboard Routes (Protected)
    BUILDER: '/builder',
    PROFILE: '/profile',
    MY_RESUMES: '/my-resumes',
    CHECKOUT: '/checkout',

    // Dynamic Routes (functions that return paths)
    blogPost: (slug: string) => `/blog/${slug}`,
    checkoutWithPlan: (plan: string, period: 'monthly' | 'yearly' = 'monthly') =>
        `/checkout?plan=${plan}&period=${period}`,
    loginWithRedirect: (redirectTo: string) => `/login?redirect=${encodeURIComponent(redirectTo)}`,
} as const;

// ============================================================================
// Route Helpers
// ============================================================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
};

/**
 * Get authentication redirect URL
 * If user is not authenticated, returns login URL with redirect parameter
 * Otherwise returns the target URL
 */
export const getAuthRedirectUrl = (targetUrl: string): string => {
    if (isAuthenticated()) {
        return targetUrl;
    }
    return ROUTES.loginWithRedirect(targetUrl);
};

/**
 * Navigate to a route with authentication check
 * Redirects to login if not authenticated, otherwise goes to target
 */
export const navigateWithAuth = (targetUrl: string): void => {
    if (typeof window === 'undefined') return;

    const url = getAuthRedirectUrl(targetUrl);
    window.location.href = url;
};

/**
 * Navigate to checkout with plan selection
 * Checks authentication and redirects accordingly
 */
export const navigateToCheckout = (plan: string, period: 'monthly' | 'yearly' = 'monthly'): void => {
    const checkoutUrl = ROUTES.checkoutWithPlan(plan, period);
    navigateWithAuth(checkoutUrl);
};

// ============================================================================
// Route Groups (for navigation menus)
// ============================================================================

export const NAVIGATION_GROUPS = {
    main: [
        { name: 'Home', href: ROUTES.HOME },
        { name: 'Builder', href: ROUTES.BUILDER },
        { name: 'ATS Checker', href: ROUTES.ATS_CHECKER },
        { name: 'Pricing', href: ROUTES.PRICING },
        { name: 'Blog', href: ROUTES.BLOG },
        { name: 'Contact', href: ROUTES.CONTACT },
    ],

    footer: [
        { name: 'About', href: ROUTES.ABOUT },
        { name: 'Pricing', href: ROUTES.PRICING },
        { name: 'Privacy', href: ROUTES.PRIVACY },
        { name: 'Terms', href: ROUTES.TERMS },
    ],

    userMenu: [
        { name: 'Profile', href: ROUTES.PROFILE, icon: 'fa-user' },
        { name: 'My Resumes', href: ROUTES.MY_RESUMES, icon: 'fa-file-lines' },
    ],
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type RouteKey = keyof typeof ROUTES;
export type NavigationGroup = keyof typeof NAVIGATION_GROUPS;
