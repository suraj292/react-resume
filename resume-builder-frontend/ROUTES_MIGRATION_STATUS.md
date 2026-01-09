# Routes Migration Status

## ✅ Completed Files

### Core Components
- ✅ `/lib/routes.ts` - Centralized routes configuration (CREATED)
- ✅ `/components/layout/header.tsx` - Updated all routes
- ✅ `/components/layout/footer.tsx` - Updated all routes
- ✅ `/app/page.tsx` - Partially updated (hero section, pricing)

### Routes Defined
All application routes are now defined in `/lib/routes.ts`:

```typescript
ROUTES = {
    // Public
    HOME, LOGIN, REGISTER,
    
    // Marketing
    PRICING, ATS_CHECKER, CONTACT, ABOUT, BLOG,
    
    // Legal
    PRIVACY, TERMS,
    
    // Dashboard (Protected)
    BUILDER, PROFILE, MY_RESUMES, CHECKOUT,
    
    // Dynamic Functions
    blogPost(slug),
    checkoutWithPlan(plan, period),
    loginWithRedirect(redirectTo),
}
```

## 🔄 Files Pending Migration

### High Priority (Frequently Used)
1. `/components/resume-builder/navbar.tsx`
   - Routes: `/`, `/profile`, `/my-resume`, `/login`
   
2. `/components/auth-required-modal.tsx`
   - Routes: `/login`, `/login?tab=register`

### Page Files
3. `/app/(auth)/login/page.tsx`
   - Routes: `/`

4. `/app/(dashboard)/profile/page.tsx`
   - Routes: `/`, `/builder`, `/ats-checker`, `/pricing`, `/profile`

5. `/app/(dashboard)/checkout/page.tsx`
   - Routes: `/pricing`, `/terms`, `/privacy`

6. `/app/(marketing)/pricing/page.tsx`
   - Routes: `/builder`, `/ats-checker`

7. `/app/(marketing)/ats-checker/page.tsx`
   - Routes: `/builder`

8. `/app/(marketing)/contact/page.tsx`
   - Routes: `/builder`, `/ats-checker`

9. `/app/(marketing)/blog/[slug]/page.tsx`
   - Routes: `/blog`, `/builder`

## 📋 Migration Checklist

For each file, follow these steps:

### Step 1: Add Import
```typescript
import { ROUTES } from '@/lib/routes';
```

### Step 2: Replace Hardcoded Routes

**Before:**
```tsx
<Link href="/builder">Builder</Link>
<Link href="/pricing">Pricing</Link>
```

**After:**
```tsx
<Link href={ROUTES.BUILDER}>Builder</Link>
<Link href={ROUTES.PRICING}>Pricing</Link>
```

### Step 3: Update Navigation Functions

**Before:**
```typescript
router.push('/login');
window.location.href = '/checkout';
```

**After:**
```typescript
router.push(ROUTES.LOGIN);
window.location.href = ROUTES.CHECKOUT;
```

### Step 4: Use Helper Functions

**For authentication-protected routes:**
```typescript
import { navigateWithAuth, navigateToCheckout } from '@/lib/routes';

// Instead of manual auth check
navigateWithAuth(ROUTES.PROFILE);

// For checkout
navigateToCheckout('pro', 'monthly');
```

## 🎯 Quick Migration Script

Use this pattern for each file:

```bash
# 1. Open file
# 2. Add import at top
import { ROUTES } from '@/lib/routes';

# 3. Find and replace (use your editor's find/replace)
href="/"          → href={ROUTES.HOME}
href="/login"     → href={ROUTES.LOGIN}
href="/builder"   → href={ROUTES.BUILDER}
href="/pricing"   → href={ROUTES.PRICING}
href="/profile"   → href={ROUTES.PROFILE}
href="/my-resume" → href={ROUTES.MY_RESUMES}
href="/ats-checker" → href={ROUTES.ATS_CHECKER}
href="/contact"   → href={ROUTES.CONTACT}
href="/about"     → href={ROUTES.ABOUT}
href="/blog"      → href={ROUTES.BLOG}
href="/privacy"   → href={ROUTES.PRIVACY}
href="/terms"     → href={ROUTES.TERMS}
href="/checkout"  → href={ROUTES.CHECKOUT}
```

## 📊 Migration Progress

- **Total Files**: 12
- **Completed**: 4 (33%)
- **Remaining**: 8 (67%)

### Completed (4/12)
- ✅ lib/routes.ts
- ✅ components/layout/header.tsx
- ✅ components/layout/footer.tsx
- ✅ app/page.tsx (partial)

### Remaining (8/12)
- ⏳ components/resume-builder/navbar.tsx
- ⏳ components/auth-required-modal.tsx
- ⏳ app/(auth)/login/page.tsx
- ⏳ app/(dashboard)/profile/page.tsx
- ⏳ app/(dashboard)/checkout/page.tsx
- ⏳ app/(marketing)/pricing/page.tsx
- ⏳ app/(marketing)/ats-checker/page.tsx
- ⏳ app/(marketing)/contact/page.tsx

## 🚀 Benefits Achieved

✅ **Centralized Management**: All routes in one file
✅ **Type Safety**: TypeScript autocomplete
✅ **No Hardcoded Strings**: Easy to refactor
✅ **Authentication Helpers**: Built-in auth checks
✅ **Consistent Naming**: Same route names everywhere

## 📝 Next Steps

1. **Complete Migration**: Update remaining 8 files
2. **Test Navigation**: Verify all links work
3. **Update Tests**: If any route-based tests exist
4. **Documentation**: Keep ROUTES_GUIDE.md updated
5. **Code Review**: Ensure no hardcoded routes remain

## 🔍 How to Find Remaining Hardcoded Routes

Run this command to find hardcoded routes:

```bash
# In the project root
grep -r 'href="/' --include="*.tsx" --include="*.ts" components/ app/
```

## ✨ Usage Examples

### Basic Link
```tsx
<Link href={ROUTES.BUILDER}>Go to Builder</Link>
```

### With Authentication
```tsx
import { navigateWithAuth } from '@/lib/routes';

const handleClick = () => {
    navigateWithAuth(ROUTES.PROFILE);
};
```

### Checkout with Plan
```tsx
import { navigateToCheckout } from '@/lib/routes';

<button onClick={() => navigateToCheckout('pro', 'monthly')}>
    Subscribe to Pro
</button>
```

### Dynamic Routes
```tsx
<Link href={ROUTES.blogPost('my-article')}>
    Read Article
</Link>
```

## 🎓 Training Notes

When adding new routes:

1. Add to `/lib/routes.ts` first
2. Use the new route constant everywhere
3. Never hardcode route strings
4. Use helper functions for auth-protected routes

## 📞 Support

If you encounter issues:
1. Check `/lib/routes.ts` for available routes
2. Review `ROUTES_GUIDE.md` for examples
3. Ensure imports are correct
4. Verify route names match exactly
