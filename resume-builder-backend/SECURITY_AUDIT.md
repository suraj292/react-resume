# Production-Grade Security & Integrity Audit — Implementation Report

## 1. Architecture Decisions

### 1.1 Payment Integrity — server-authoritative pricing

| Before | After |
|---|---|
| Client sent `amount`, `base_price`, `gst_amount` to backend | Backend accepts only `plan_slug`, `period`, `coupon_code`, `phone_number`, `currency` |
| Amounts stored directly from client | Prices computed from `PricingPlan.pricing` server-side |
| `verifyPayment` re-accepted coupon/discount from client | All coupon info read from the already-created `Order` row |
| No idempotency check | Already-completed order returns 200 immediately |
| No DB transaction | `verifyPayment` uses `lockForUpdate` transaction for order + coupon + subscription |

### 1.2 Subscription consistency — explicit `subscriptions` table

- `orders` → immutable payment ledger (written once, never mutated after completion)
- `subscriptions` → single source of truth for plan state (1 active row per user)

`PlanAccessService::getUserPlan()` reads from `subscriptions`, not `orders`.
Cache invalidated on every successful payment via `clearUserPlanCache()`.

### 1.3 Usage tracking

| Endpoint | Tracked as |
|---|---|
| `POST /api/ats/analyze` | `AiRequest` type=`ats_analysis` |
| `POST /api/uploads/resume` | `AiRequest` type=`resume_upload_parse` |
| `POST /api/uploads/job-description` | `AiRequest` type=`job_description_parse` |
| `POST /api/export/pdf` | `Download` format=`pdf` |

### 1.4 Auth gating — three layers

```
Edge (Next.js middleware) → auth_present cookie check (0 DB IO)
Page components → useAuth() redirect after loading=false && !user
Backend → auth:sanctum + plan.limit middleware
```

### 1.5 Currency — dynamic, user-persisted

- `formatCurrency(amount, currency)` helper in frontend — zero hardcoded `₹`
- GST shown only when currency = INR
- `users.currency_preference` persists user choice
- GeolocationController: 24h cache per-IP, cascade to ip-api.com on failure

### 1.6 API response consistency

All three auth endpoints (login / register / me) return identical `userPayload()` with `plan`, `subscription`, and `limits` embedded.

### 1.7 Security hardening

| Issue | Fix |
|---|---|
| `shell_exec('which node')` per PDF request | `config('services.browsershot.node_binary')` |
| `user_id = 1` hardcoded in UploadController | `Auth::user()->id` |
| No upload ownership check on getStatus | `where('user_id', $user->id)` added |
| Internal exceptions leaked to client | Generic messages; full detail in structured logs |
| `env()` called directly in controllers | All via `config('services.*')` |

---

## 2. All Changed Files

### Backend

| File | Change |
|---|---|
| `PaymentController.php` | Full rewrite — server pricing, idempotency, DB transaction |
| `PlanAccessService.php` | Reads `subscriptions`; adds `getSubscriptionSummary()`, `clearUserPlanCache()` |
| `CheckPlanLimit.php` | Consistent `plan_limit_exceeded` key, `feature` field, structured log |
| `AuthController.php` | Standardised `userPayload()` with plan/subscription/limits |
| `PlanController.php` | Constructor injection; uses `getSubscriptionSummary()` |
| `PdfExportController.php` | Config-based binaries, `trackDownload()`, sanitised errors |
| `UploadController.php` | Fixed `user_id=1`, `trackAIRequest()`, ownership check |
| `ATSController.php` | `TracksUsage` trait, `trackAIRequest()` in success + error paths |
| `GeolocationController.php` | Per-IP 24h cache, two-provider cascade |
| `UserProfileController.php` | `currency_preference` in update validation + response |
| `TracksUsage.php` | Structured log on every track call |
| `User.php` | `currency_preference` fillable; `activeSubscription()` → Subscription model |
| `Subscription.php` | **New model** |
| `config/services.php` | Added `razorpay` + `browsershot` config blocks |

### Migrations

| File | What |
|---|---|
| `2026_03_28_100000_create_subscriptions_table.php` | New `subscriptions` table |
| `2026_03_28_100001_add_currency_preference_to_users.php` | `currency_preference VARCHAR(3)` on `users` |

### Frontend

| File | Change |
|---|---|
| `middleware.ts` | Auth-gating via `auth_present` cookie |
| `contexts/AuthContext.tsx` | Cookie management, `refreshUser()`, typed User with plan/subscription/limits |
| `app/(dashboard)/checkout/page.tsx` | `formatCurrency()`, server-trusted pricing, `refreshUser()` after verify |
| `lib/api.ts` | `currency_preference` in `UserProfile` interface |

### Tests

| File | Scenarios |
|---|---|
| `tests/Feature/PaymentTest.php` | unauthenticated, amounts ignored, server pricing, coupon, invalid plan, verify success, idempotent, bad sig, wrong owner |
| `tests/Feature/PlanLimitTest.php` | 403 payload shape, subscription authority, active/expired, monthly counter |
| `tests/Feature/AuthTest.php` | Payload structure, currency, /me after sub activated, 401 |

---

## 3. Rollout Steps

### Step 1 — Migrate

```bash
cd resume-builder-backend && php artisan migrate
```

### Step 2 — Backfill existing paid users (run in tinker once)

```php
use App\Models\{Order, Subscription};

Order::where('payment_status', 'completed')
    ->where('valid_until', '>', now())
    ->orderBy('created_at')
    ->each(function ($order) {
        Subscription::where('user_id', $order->user_id)->update(['status' => 'expired']);
        Subscription::create([
            'user_id'     => $order->user_id,
            'order_id'    => $order->id,
            'plan_slug'   => $order->plan_slug,
            'period'      => $order->period,
            'status'      => 'active',
            'valid_from'  => $order->valid_from,
            'valid_until' => $order->valid_until,
        ]);
    });
```

### Step 3 — .env additions

```dotenv
RAZORPAY_KEY_ID=rzp_live_xxx       # already set
RAZORPAY_KEY_SECRET=yyy             # already set
BROWSERSHOT_NODE_BINARY=/usr/local/bin/node
BROWSERSHOT_NPM_BINARY=/usr/local/bin/npm
```

### Step 4 — Clear caches

```bash
php artisan cache:clear && php artisan config:clear
```

### Step 5 — Frontend deployment

Existing sessions are preserved — `AuthContext` sets `auth_present` cookie from localStorage `auth_token` on mount.

---

## 4. Tests

```bash
php artisan test tests/Feature/PaymentTest.php
php artisan test tests/Feature/PlanLimitTest.php
php artisan test tests/Feature/AuthTest.php
```

If factories for `AiRequest`, `Download`, or `Resume` don't exist:
```bash
php artisan make:factory AiRequestFactory --model=AiRequest
php artisan make:factory DownloadFactory  --model=Download
php artisan make:factory ResumeFactory    --model=Resume
```

---

## 5. Risks & Rollback

| Risk | Mitigation | Rollback |
|---|---|---|
| Backfill misses lifetime orders | Adjust where clause | `migrate:rollback` drops subscriptions; old hasOne on orders still works |
| `auth_present` blocks mid-session users | Page guard only fires after loading=false | Remove `isProtectedPath()` block in middleware.ts |
| Razorpay config mismatch | Catches exception, returns 500 with safe message | Fix .env |
| Oversized PDF HTML | 2 MB validation cap in PdfExportController | Lower the max value |
| Browsershot binary wrong | Only called when config is non-null | Remove BROWSERSHOT_NODE_BINARY from .env |
