<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\PricingPlan;
use App\Models\Subscription;
use App\Services\PlanAccessService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;

class PaymentController extends Controller
{
    private const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR'];

    // -------------------------------------------------------------------------
    // Create Razorpay order
    // -------------------------------------------------------------------------

    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'plan_slug'    => 'required|string|exists:pricing_plans,slug',
            'period'       => 'required|in:monthly,yearly',
            'coupon_code'  => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:20',
            'currency'     => 'nullable|string|in:INR,USD,EUR',
        ]);

        $user     = Auth::user();
        $currency = strtoupper($validated['currency'] ?? 'INR');

        // Server-side price computation – never trust the client
        $plan = PricingPlan::where('slug', $validated['plan_slug'])->firstOrFail();
        [$basePrice, $gstAmount, $discountAmount, $coupon] = $this->computePricing(
            $plan,
            $validated['period'],
            $currency,
            $validated['coupon_code'] ?? null
        );

        $totalAmount   = max(0, $basePrice + $gstAmount - $discountAmount);
        $amountInSmall = (int) round($totalAmount * 100); // paise / cents

        try {
            $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

            $razorpayOrder = $api->order->create([
                'receipt'  => 'rcpt_' . uniqid() . '_' . $user->id,
                'amount'   => $amountInSmall,
                'currency' => $currency,
                'notes'    => [
                    'user_id'    => $user->id,
                    'user_email' => $user->email,
                    'plan_slug'  => $plan->slug,
                    'period'     => $validated['period'],
                ],
            ]);

            Order::create([
                'order_id'        => $razorpayOrder['id'],
                'user_id'         => $user->id,
                'plan_slug'       => $plan->slug,
                'plan_name'       => $plan->name,
                'period'          => $validated['period'],
                'base_price'      => $basePrice,
                'gst_amount'      => $gstAmount,
                'discount_amount' => $discountAmount,
                'total_amount'    => $totalAmount,
                'currency'        => $currency,
                'coupon_id'       => $coupon?->id,
                'coupon_code'     => $coupon?->code,
                'payment_status'  => 'pending',
                'phone_number'    => $validated['phone_number'] ?? null,
            ]);

            Log::info('payment.order_created', [
                'user_id'          => $user->id,
                'razorpay_id'      => $razorpayOrder['id'],
                'plan'             => $plan->slug,
                'period'           => $validated['period'],
                'total_amount'     => $totalAmount,
                'currency'         => $currency,
            ]);

            return response()->json([
                'success'  => true,
                'order_id' => $razorpayOrder['id'],
                'amount'   => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'key_id'   => config('services.razorpay.key'),
                // Return server-computed prices so UI can confirm
                'pricing'  => [
                    'base_price'      => $basePrice,
                    'gst_amount'      => $gstAmount,
                    'discount_amount' => $discountAmount,
                    'total_amount'    => $totalAmount,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('payment.order_create_failed', [
                'user_id' => $user->id,
                'plan'    => $validated['plan_slug'],
                'error'   => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create order. Please try again.',
            ], 500);
        }
    }

    // -------------------------------------------------------------------------
    // Verify payment (idempotent)
    // -------------------------------------------------------------------------

    public function verifyPayment(Request $request)
    {
        $validated = $request->validate([
            'razorpay_order_id'   => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature'  => 'required|string',
        ]);

        $user = Auth::user();

        // ── Idempotency guard ──────────────────────────────────────────────
        // Return 200 immediately if already verified (safe retries)
        $existingOrder = Order::where('order_id', $validated['razorpay_order_id'])
            ->where('payment_status', 'completed')
            ->first();

        if ($existingOrder) {
            Log::info('payment.verify_idempotent', [
                'user_id'          => $user->id,
                'razorpay_order_id' => $validated['razorpay_order_id'],
            ]);
            return response()->json([
                'success'    => true,
                'message'    => 'Payment already verified.',
                'payment_id' => $existingOrder->payment_id,
                'order_id'   => $existingOrder->order_id,
            ]);
        }

        // ── Ownership check ───────────────────────────────────────────────
        $order = Order::where('order_id', $validated['razorpay_order_id'])
            ->where('user_id', $user->id)
            ->where('payment_status', 'pending')
            ->first();

        if (!$order) {
            Log::warning('payment.verify_ownership_failed', [
                'user_id'          => $user->id,
                'razorpay_order_id' => $validated['razorpay_order_id'],
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Order not found or does not belong to you.',
            ], 404);
        }

        // ── Signature verification ────────────────────────────────────────
        try {
            $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
            $api->utility->verifyPaymentSignature([
                'razorpay_order_id'   => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature'  => $validated['razorpay_signature'],
            ]);
        } catch (\Razorpay\Api\Errors\SignatureVerificationError $e) {
            Log::warning('payment.signature_invalid', [
                'user_id'          => $user->id,
                'razorpay_order_id' => $validated['razorpay_order_id'],
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: invalid signature.',
            ], 400);
        }

        // ── Transactional update (order + coupon + subscription) ──────────
        try {
            DB::transaction(function () use ($order, $user, $validated) {
                // Lock order row to prevent double-processing
                $order = Order::lockForUpdate()->find($order->id);

                if ($order->payment_status === 'completed') {
                    return; // Already processed by concurrent request
                }

                $validFrom  = Carbon::now();
                $validUntil = $order->period === 'yearly'
                    ? $validFrom->copy()->addYear()
                    : $validFrom->copy()->addMonth();

                // Update order (immutable ledger)
                $order->update([
                    'payment_id'        => $validated['razorpay_payment_id'],
                    'payment_signature' => $validated['razorpay_signature'],
                    'payment_status'    => 'completed',
                    'valid_from'        => $validFrom,
                    'valid_until'       => $validUntil,
                ]);

                // Record coupon usage if one was applied at order creation
                if ($order->coupon_id) {
                    $alreadyUsed = CouponUsage::where('coupon_id', $order->coupon_id)
                        ->where('user_id', $user->id)
                        ->where('order_id', $order->order_id)
                        ->exists();

                    if (!$alreadyUsed) {
                        CouponUsage::create([
                            'coupon_id'       => $order->coupon_id,
                            'user_id'         => $user->id,
                            'order_id'        => $order->order_id,
                            'discount_amount' => $order->discount_amount,
                            'used_at'         => $validFrom,
                        ]);
                        Coupon::where('id', $order->coupon_id)->increment('current_uses');
                    }
                }

                // Deactivate all previous active subscriptions for this user
                Subscription::where('user_id', $user->id)
                    ->where('status', 'active')
                    ->update(['status' => 'expired']);

                // Create the new canonical subscription record
                Subscription::create([
                    'user_id'     => $user->id,
                    'order_id'    => $order->id,
                    'plan_slug'   => $order->plan_slug,
                    'period'      => $order->period,
                    'status'      => 'active',
                    'valid_from'  => $validFrom,
                    'valid_until' => $validUntil,
                ]);
            });

            // Invalidate plan cache so PlanAccessService picks up new plan
            app(PlanAccessService::class)->clearUserPlanCache($user);

            Log::info('payment.verified', [
                'user_id'          => $user->id,
                'razorpay_order_id' => $validated['razorpay_order_id'],
                'razorpay_pay_id'   => $validated['razorpay_payment_id'],
                'plan_slug'         => $order->plan_slug,
            ]);

            return response()->json([
                'success'    => true,
                'message'    => 'Payment verified successfully.',
                'payment_id' => $validated['razorpay_payment_id'],
                'order_id'   => $validated['razorpay_order_id'],
            ]);

        } catch (\Exception $e) {
            Log::error('payment.verify_failed', [
                'user_id'          => $user->id,
                'razorpay_order_id' => $validated['razorpay_order_id'],
                'error'            => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed. Please contact support.',
            ], 500);
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Compute pricing entirely on the server.
     * Returns [basePrice, gstAmount, discountAmount, ?Coupon].
     */
    private function computePricing(
        PricingPlan $plan,
        string $period,
        string $currency,
        ?string $couponCode
    ): array {
        $currencyKey = strtolower($currency); // 'inr' | 'usd' | 'eur'
        $pricing     = $plan->pricing[$currencyKey] ?? $plan->pricing['inr'];

        // Prices are stored in smallest unit (paise/cents) → convert to main unit
        $basePrice = $period === 'yearly'
            ? ($pricing['yearly'] ?? 0) / 100
            : ($pricing['monthly'] ?? 0) / 100;

        // GST only for INR (Indian regulatory requirement)
        $gstRate   = $currency === 'INR' ? 0.18 : 0.0;
        $gstAmount = round($basePrice * $gstRate, 2);

        $discountAmount = 0;
        $coupon         = null;

        if ($couponCode) {
            $coupon = Coupon::where('code', strtoupper($couponCode))
                ->where('is_active', true)
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                })
                ->where(function ($q) {
                    $q->whereNull('max_uses')->orWhereColumn('current_uses', '<', 'max_uses');
                })
                ->first();

            if ($coupon) {
                $discountAmount = $coupon->discount_type === 'percentage'
                    ? round($basePrice * ($coupon->discount_value / 100), 2)
                    : min($coupon->discount_value, $basePrice);
            }
        }

        return [$basePrice, $gstAmount, $discountAmount, $coupon];
    }
}
