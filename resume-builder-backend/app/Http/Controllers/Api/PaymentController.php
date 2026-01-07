<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Razorpay\Api\Api;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use Carbon\Carbon;

class PaymentController extends Controller
{
    /**
     * Create a Razorpay order
     */
    public function createOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'plan_slug' => 'required|string',
            'plan_name' => 'required|string',
            'period' => 'required|in:monthly,yearly',
            'base_price' => 'required|numeric',
            'gst_amount' => 'required|numeric',
            'discount_amount' => 'nullable|numeric',
            'coupon_code' => 'nullable|string',
            'phone_number' => 'nullable|string',
        ]);

        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated',
            ], 401);
        }

        try {
            $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
            
            // Amount should be in paise (multiply by 100) and must be an integer
            $amountInPaise = (int) round($request->amount * 100);
            
            $orderData = [
                'receipt' => 'order_' . time() . '_' . $user->id,
                'amount' => $amountInPaise,
                'currency' => 'INR',
                'notes' => [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'plan_slug' => $request->plan_slug,
                    'period' => $request->period,
                    'coupon_code' => $request->coupon_code ?? null,
                ]
            ];
            
            $razorpayOrder = $api->order->create($orderData);
            
            // Create order record in database
            $coupon = null;
            if ($request->coupon_code) {
                $coupon = Coupon::where('code', strtoupper($request->coupon_code))->first();
            }
            
            Order::create([
                'order_id' => $razorpayOrder['id'],
                'user_id' => $user->id,
                'plan_slug' => $request->plan_slug,
                'plan_name' => $request->plan_name,
                'period' => $request->period,
                'base_price' => $request->base_price,
                'gst_amount' => $request->gst_amount,
                'discount_amount' => $request->discount_amount ?? 0,
                'total_amount' => $request->amount,
                'currency' => 'INR',
                'coupon_id' => $coupon?->id,
                'coupon_code' => $request->coupon_code,
                'payment_status' => 'pending',
                'phone_number' => $request->phone_number,
            ]);
            
            return response()->json([
                'success' => true,
                'order_id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'key_id' => env('RAZORPAY_KEY_ID'),
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify Razorpay payment signature
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
            'coupon_code' => 'nullable|string',
            'discount_amount' => 'nullable|numeric',
        ]);

        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated',
            ], 401);
        }

        try {
            $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
            
            // Verify signature
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature,
            ];
            
            $api->utility->verifyPaymentSignature($attributes);
            
            // If coupon was used, record the usage
            if ($request->coupon_code && $request->discount_amount) {
                $coupon = Coupon::where('code', strtoupper($request->coupon_code))->first();
                
                if ($coupon) {
                    CouponUsage::create([
                        'coupon_id' => $coupon->id,
                        'user_id' => $user->id,
                        'order_id' => $request->razorpay_order_id,
                        'discount_amount' => $request->discount_amount,
                        'used_at' => Carbon::now(),
                    ]);
                    
                    // Increment coupon usage count
                    $coupon->increment('current_uses');
                }
            }
            
            // Update order record
            $order = Order::where('order_id', $request->razorpay_order_id)->first();
            
            if ($order) {
                $validFrom = Carbon::now();
                $validUntil = $order->period === 'monthly' 
                    ? $validFrom->copy()->addMonth()
                    : $validFrom->copy()->addYear();
                
                $order->update([
                    'payment_id' => $request->razorpay_payment_id,
                    'payment_signature' => $request->razorpay_signature,
                    'payment_status' => 'completed',
                    'valid_from' => $validFrom,
                    'valid_until' => $validUntil,
                ]);
            }
            
            // Here you would typically:
            // 1. Update user subscription status
            // 2. Send confirmation email
            
            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully',
                'payment_id' => $request->razorpay_payment_id,
                'order_id' => $request->razorpay_order_id,
            ]);
            
        } catch (\Razorpay\Api\Errors\SignatureVerificationError $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: Invalid signature',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
