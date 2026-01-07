<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\CouponUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CouponController extends Controller
{
    /**
     * Validate a coupon code
     */
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric|min:0',
        ]);

        $code = strtoupper(trim($request->code));
        $amount = $request->amount;
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'valid' => false,
                'message' => 'You must be logged in to use a coupon.',
            ], 401);
        }

        // Find the coupon
        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid coupon code.',
            ], 404);
        }

        // Check if coupon is active
        if (!$coupon->is_active) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon is no longer active.',
            ], 400);
        }

        // Check validity period
        if ($coupon->valid_from && Carbon::now()->isBefore($coupon->valid_from)) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon is not yet valid.',
            ], 400);
        }

        if ($coupon->valid_until && Carbon::now()->isAfter($coupon->valid_until)) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has expired.',
            ], 400);
        }

        // Check max uses
        if ($coupon->max_uses && $coupon->current_uses >= $coupon->max_uses) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has reached its maximum usage limit.',
            ], 400);
        }

        // Check user-specific usage limit
        $userUsageCount = CouponUsage::where('coupon_id', $coupon->id)
            ->where('user_id', $user->id)
            ->count();

        if ($userUsageCount >= $coupon->max_uses_per_user) {
            return response()->json([
                'valid' => false,
                'message' => 'You have already used this coupon the maximum number of times.',
            ], 400);
        }

        // Check minimum purchase amount
        if ($coupon->min_purchase_amount && $amount < $coupon->min_purchase_amount) {
            return response()->json([
                'valid' => false,
                'message' => sprintf(
                    'Minimum purchase amount of ₹%s required to use this coupon.',
                    number_format($coupon->min_purchase_amount, 2)
                ),
            ], 400);
        }

        // Calculate discount
        $discountAmount = $coupon->calculateDiscount($amount);

        return response()->json([
            'valid' => true,
            'message' => 'Coupon applied successfully!',
            'coupon' => [
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'formatted_value' => $coupon->formatted_value,
                'description' => $coupon->description,
            ],
            'discount_amount' => $discountAmount,
            'formatted_discount' => '₹' . number_format($discountAmount, 2),
        ]);
    }

    /**
     * Apply/record coupon usage (called after successful payment)
     */
    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'order_id' => 'required|string',
            'discount_amount' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();
        $coupon = Coupon::where('code', strtoupper(trim($request->code)))->first();

        if (!$coupon || !$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid request.',
            ], 400);
        }

        // Record usage
        CouponUsage::create([
            'coupon_id' => $coupon->id,
            'user_id' => $user->id,
            'order_id' => $request->order_id,
            'discount_amount' => $request->discount_amount,
            'used_at' => Carbon::now(),
        ]);

        // Increment coupon usage count
        $coupon->increment('current_uses');

        return response()->json([
            'success' => true,
            'message' => 'Coupon usage recorded successfully.',
        ]);
    }
}
