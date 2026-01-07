# Centralized Routes Management

This document explains how to use the centralized routes system in the application.

## Overview

All application routes are defined in `/lib/routes.ts`. This provides:
- **Single source of truth** for all routes
- **Type safety** with TypeScript
- **Easy refactoring** - change a route in one place
- **Helper functions** for common navigation patterns
- **Authentication checks** built-in

## Basic Usage

### Importing Routes

```typescript
import { ROUTES } from '@/lib/routes';
```

### Using Routes in Links

**Before (hardcoded):**
```tsx
<Link href="/builder">Build Resume</Link>
<Link href="/pricing">Pricing</Link>
```

**After (centralized):**
```tsx
<Link href={ROUTES.BUILDER}>Build Resume</Link>
<Link href={ROUTES.PRICING}>Pricing</Link>
```

### Dynamic Routes

For routes with parameters, use the helper functions:

```typescript
// Blog post
const blogUrl = ROUTES.blogPost('my-post-slug');
// Result: /blog/my-post-slug

// Checkout with plan
const checkoutUrl = ROUTES.checkoutWithPlan('pro', 'monthly');
// Result: /checkout?plan=pro&period=monthly

// Login with redirect
const loginUrl = ROUTES.loginWithRedirect('/builder');
// Result: /login?redirect=%2Fbuilder
```

## Navigation Helpers

### Navigate with Authentication Check

Use `navigateWithAuth` to redirect to login if user is not authenticated:

```typescript
import { navigateWithAuth } from '@/lib/routes';

// Will redirect to login if not authenticated
// Otherwise goes directly to the target URL
navigateWithAuth('/profile');
```

### Navigate to Checkout

Use `navigateToCheckout` for plan selection:

```typescript
import { navigateToCheckout } from '@/lib/routes';

// Checks auth and redirects to checkout with plan
navigateToCheckout('pro', 'monthly');

// If not authenticated: /login?redirect=/checkout?plan=pro&period=monthly
// If authenticated: /checkout?plan=pro&period=monthly
```

### Check Authentication

```typescript
import { isAuthenticated } from '@/lib/routes';

if (isAuthenticated()) {
    // User is logged in
} else {
    // User is not logged in
}
```

## Navigation Groups

Pre-defined navigation groups for menus:

```typescript
import { NAVIGATION_GROUPS } from '@/lib/routes';

// Main navigation
NAVIGATION_GROUPS.main.map(item => (
    <Link key={item.name} href={item.href}>
        {item.name}
    </Link>
));

// Footer navigation
NAVIGATION_GROUPS.footer.map(item => (
    <Link key={item.name} href={item.href}>
        {item.name}
    </Link>
));

// User menu
NAVIGATION_GROUPS.userMenu.map(item => (
    <Link key={item.name} href={item.href}>
        <i className={`fa-solid ${item.icon}`}></i>
        {item.name}
    </Link>
));
```

## Available Routes

### Public Routes
- `ROUTES.HOME` - `/`
- `ROUTES.LOGIN` - `/login`
- `ROUTES.REGISTER` - `/login?tab=register`

### Marketing Pages
- `ROUTES.PRICING` - `/pricing`
- `ROUTES.ATS_CHECKER` - `/ats-checker`
- `ROUTES.CONTACT` - `/contact`
- `ROUTES.ABOUT` - `/about`
- `ROUTES.BLOG` - `/blog`

### Legal Pages
- `ROUTES.PRIVACY` - `/privacy`
- `ROUTES.TERMS` - `/terms`

### Dashboard Routes
- `ROUTES.BUILDER` - `/builder`
- `ROUTES.PROFILE` - `/profile`
- `ROUTES.MY_RESUMES` - `/my-resumes`
- `ROUTES.CHECKOUT` - `/checkout`

## Migration Guide

### Step 1: Import Routes
```typescript
import { ROUTES, navigateToCheckout } from '@/lib/routes';
```

### Step 2: Replace Hardcoded Strings

**Links:**
```tsx
// Before
<Link href="/builder">Builder</Link>

// After
<Link href={ROUTES.BUILDER}>Builder</Link>
```

**Navigation:**
```tsx
// Before
window.location.href = '/login';

// After
import { navigateWithAuth } from '@/lib/routes';
navigateWithAuth(ROUTES.PROFILE);
```

**Checkout:**
```tsx
// Before
const token = localStorage.getItem('auth_token');
if (!token) {
    window.location.href = `/login?redirect=/checkout?plan=${plan}&period=monthly`;
} else {
    window.location.href = `/checkout?plan=${plan}&period=monthly`;
}

// After
navigateToCheckout(plan, 'monthly');
```

## Adding New Routes

To add a new route:

1. Open `/lib/routes.ts`
2. Add to the `ROUTES` object:

```typescript
export const ROUTES = {
    // ... existing routes
    NEW_PAGE: '/new-page',
    
    // For dynamic routes, add a function
    userProfile: (userId: string) => `/users/${userId}`,
} as const;
```

3. Use it in your components:

```tsx
import { ROUTES } from '@/lib/routes';

<Link href={ROUTES.NEW_PAGE}>New Page</Link>
<Link href={ROUTES.userProfile('123')}>User Profile</Link>
```

## Benefits

✅ **Type Safety** - TypeScript autocomplete for all routes
✅ **Refactoring** - Change route in one place, updates everywhere
✅ **No Typos** - Compile-time errors for invalid routes
✅ **Authentication** - Built-in auth checks
✅ **Consistency** - Same route format across the app
✅ **Documentation** - All routes visible in one file

## Examples

### Example 1: Header Navigation

```tsx
import { NAVIGATION_GROUPS } from '@/lib/routes';

export function Header() {
    return (
        <nav>
            {NAVIGATION_GROUPS.main.map(item => (
                <Link key={item.name} href={item.href}>
                    {item.name}
                </Link>
            ))}
        </nav>
    );
}
```

### Example 2: Pricing Card Click

```tsx
import { navigateToCheckout } from '@/lib/routes';

function PricingCard({ plan }) {
    return (
        <div onClick={() => navigateToCheckout(plan.slug, 'monthly')}>
            <h3>{plan.name}</h3>
            <button>Get Started</button>
        </div>
    );
}
```

### Example 3: Protected Route

```tsx
import { isAuthenticated, ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';

export function ProtectedPage() {
    const router = useRouter();
    
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(ROUTES.loginWithRedirect(window.location.pathname));
        }
    }, []);
    
    return <div>Protected Content</div>;
}
```

## Best Practices

1. **Always use ROUTES constants** instead of hardcoded strings
2. **Use helper functions** for authentication checks
3. **Add new routes to routes.ts** before using them
4. **Use navigation groups** for consistent menus
5. **Document dynamic routes** with clear parameter names

## Migration Checklist

- [ ] Replace all hardcoded route strings with `ROUTES` constants
- [ ] Update authentication checks to use `navigateWithAuth`
- [ ] Replace checkout navigation with `navigateToCheckout`
- [ ] Update navigation menus to use `NAVIGATION_GROUPS`
- [ ] Test all navigation flows
- [ ] Update any route-related tests
