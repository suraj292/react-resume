# Refactor API Calls to Centralized Client

## ✅ What Was Done

Refactored the frontend codebase to use a centralized API client with `interceptors` for consistent token handling, base URL configuration, and error management.

### **1. Centralized API Client (`lib/api.ts`)**
Created a robust implementation using `axios` with categorized API modules:
- `authAPI`: Login, register, logout, me, social auth
- `pricingAPI`: Currency detection, pricing plans
- `contactAPI`: Contact settings, enquiry submission
- `resumeAPI`: CRUD operations for resumes
- `uploadAPI`: Resume upload, JD upload, upload status
- `atsAPI`: Resume analysis
- `pdfAPI`: PDF export
- `couponAPI`: Coupon verification
- `paymentAPI`: Order creation, payment verification

**Key Features:**
- **Automatic Auth Token**: Request interceptor injects `Authorization: Bearer <token>` from localStorage.
- **Global Error Handling**: Response interceptor redirects to `/login` on 401 Unauthorized.
- **Base URL**: Configured via `NEXT_PUBLIC_API_URL`.

### **2. Updated Files**

All direct `axios` and `fetch` calls were replaced with the new API client methods.

| File | Changes |
|------|---------|
| `app/page.tsx` | Replaced `axios.get` with `pricingAPI.detectCurrency` and `pricingAPI.getPlans`. |
| `app/(marketing)/pricing/page.tsx` | Replaced `axios.get` with `pricingAPI`. |
| `app/(marketing)/contact/page.tsx` | Replaced `axios.post` with `contactAPI.submitEnquiry`. |
| `components/resume-builder/navbar.tsx` | Replaced `fetch` with `pdfAPI.export`. Removed manual token header construction. |
| `components/resume-builder/tabs/tab-upload.tsx` | Replaced `fetch` with `uploadAPI.uploadResume` and `uploadAPI.analyzeJobDescription`. |
| `components/resume-builder/upload-progress.tsx` | Replaced `fetch` with `uploadAPI.getUploadStatus`. |
| `lib/stores/resume-store.ts` | Replaced `fetch` in `saveResume` and `loadResume` with `resumeAPI.update` and `resumeAPI.getOne`. Updated error handling for axios errors. |
| `app/(dashboard)/checkout/page.tsx` | Replaced strict `fetch` calls with `pricingAPI`, `couponAPI`, and `paymentAPI`. |
| `lib/api/pdf-export.ts` | Updated to use `pdfAPI.export`. |

### **3. Benefits**
- **Maintainability**: API logic is centralized. Changing an endpoint requires updating only one file.
- **Consistency**: All requests now consistently handle auth tokens and errors.
- **Cleaner Code**: Components are free from low-level HTTP implementation details (like constructing headers manually).
- **Type Safety**: API methods provide better typing support.

## Usage Example

**Before:**
```typescript
const response = await fetch('/api/resumes/123', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
const data = await response.json();
```

**After:**
```typescript
import { resumeAPI } from '@/lib/api';

const response = await resumeAPI.getOne(123);
const data = response.data;
```
