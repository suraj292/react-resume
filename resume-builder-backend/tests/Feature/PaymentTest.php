<?php

namespace Tests\Feature;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\PricingPlan;
use App\Models\Subscription;
use App\Models\User;
use App\Services\PlanAccessService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Mockery;
use Razorpay\Api\Api;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private PricingPlan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['email_verified_at' => now()]);

        $this->plan = PricingPlan::create([
            'name'                      => 'Pro',
            'slug'                      => 'pro',
            'description'               => 'Pro plan',
            'is_active'                 => true,
            'pricing'                   => [
                'inr' => ['monthly' => 99900, 'yearly' => 999900],
                'usd' => ['monthly' => 1900,  'yearly' => 19900],
                'eur' => ['monthly' => 1800,  'yearly' => 18000],
            ],
            'max_resumes'               => 10,
            'max_templates'             => null,
            'max_downloads_per_month'   => 20,
            'max_ai_requests_per_month' => 50,
            'can_export_pdf'            => true,
            'can_export_docx'           => true,
        ]);
    }

    // ── createOrder ───────────────────────────────────────────────────────────

    /** @test */
    public function create_order_rejects_unauthenticated_requests()
    {
        $res = $this->postJson('/api/payments/create-order', [
            'plan_slug' => 'pro',
            'period'    => 'monthly',
        ]);

        $res->assertStatus(401);
    }

    /** @test */
    public function create_order_rejects_client_provided_amounts()
    {
        // The new endpoint does NOT accept amount / base_price / gst_amount.
        // Sending them should not affect the server-computed total.
        $fakeRazorpayOrderId = 'order_fake123';

        $this->mockRazorpayOrderCreate($fakeRazorpayOrderId, 11780); // 999 INR + 18% GST = 117.82 → 11782 paise

        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/payments/create-order', [
                'plan_slug' => 'pro',
                'period'    => 'monthly',
                // Attacker tries to set a tiny amount
                'amount'     => 1,
                'base_price' => 1,
                'gst_amount' => 0,
            ]);

        // Only allowed fields are plan_slug, period, coupon_code, phone_number, currency
        // The 'amount' field is not in validation rules so it's ignored.
        $res->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonPath('pricing.base_price', 999.0);
    }

    /** @test */
    public function create_order_computes_price_server_side()
    {
        $this->mockRazorpayOrderCreate('order_test1', 117820);

        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/payments/create-order', [
                'plan_slug' => 'pro',
                'period'    => 'monthly',
                'currency'  => 'INR',
            ]);

        $res->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('pricing.base_price', 999.0)
            ->assertJsonPath('pricing.gst_amount', 179.82);
    }

    /** @test */
    public function create_order_applies_valid_coupon_discount()
    {
        $coupon = Coupon::create([
            'code'           => 'SAVE20',
            'discount_type'  => 'percentage',
            'discount_value' => 20,
            'is_active'      => true,
            'max_uses'       => 100,
            'current_uses'   => 0,
        ]);

        $this->mockRazorpayOrderCreate('order_coup1', 95000);

        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/payments/create-order', [
                'plan_slug'   => 'pro',
                'period'      => 'monthly',
                'currency'    => 'INR',
                'coupon_code' => 'SAVE20',
            ]);

        $res->assertOk()
            ->assertJsonPath('success', true);

        $discount = $res->json('pricing.discount_amount');
        $this->assertEquals(199.8, round($discount, 2)); // 20% of 999
    }

    /** @test */
    public function create_order_rejects_invalid_plan_slug()
    {
        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/payments/create-order', [
                'plan_slug' => 'nonexistent-plan',
                'period'    => 'monthly',
            ]);

        $res->assertStatus(422);
    }

    // ── verifyPayment ─────────────────────────────────────────────────────────

    /** @test */
    public function verify_payment_activates_subscription_on_success()
    {
        $order = Order::create([
            'order_id'       => 'order_rzp001',
            'user_id'        => $this->user->id,
            'plan_slug'      => 'pro',
            'plan_name'      => 'Pro',
            'period'         => 'monthly',
            'base_price'     => 999,
            'gst_amount'     => 179.82,
            'discount_amount'=> 0,
            'total_amount'   => 1178.82,
            'currency'       => 'INR',
            'payment_status' => 'pending',
        ]);

        $this->mockRazorpaySignatureValid();

        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/payments/verify', [
                'razorpay_order_id'   => 'order_rzp001',
                'razorpay_payment_id' => 'pay_test001',
                'razorpay_signature'  => 'valid_sig',
            ]);

        $res->assertOk()->assertJsonPath('success', true);

        // Order must be marked completed
        $this->assertDatabaseHas('orders', [
            'order_id'       => 'order_rzp001',
            'payment_status' => 'completed',
            'payment_id'     => 'pay_test001',
        ]);

        // Subscription created
        $this->assertDatabaseHas('subscriptions', [
            'user_id'   => $this->user->id,
            'plan_slug' => 'pro',
            'status'    => 'active',
        ]);

        // Plan cache cleared
        $this->assertNull(Cache::get("user_plan_{$this->user->id}"));
    }

    /** @test */
    public function verify_payment_is_idempotent_on_retry()
    {
        $order = Order::create([
            'order_id'       => 'order_rzp002',
            'user_id'        => $this->user->id,
            'plan_slug'      => 'pro',
            'plan_name'      => 'Pro',
            'period'         => 'monthly',
            'base_price'     => 999,
            'gst_amount'     => 179.82,
            'discount_amount'=> 0,
            'total_amount'   => 1178.82,
            'currency'       => 'INR',
            'payment_id'     => 'pay_already_done',
            'payment_status' => 'completed',
            'valid_from'     => now()->subDay(),
            'valid_until'    => now()->addMonth(),
        ]);

        // Should not need to call Razorpay API at all — returns 200 immediately
        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/payments/verify', [
                'razorpay_order_id'   => 'order_rzp002',
                'razorpay_payment_id' => 'pay_already_done',
                'razorpay_signature'  => 'any_sig',
            ]);

        $res->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Payment already verified.');
    }

    /** @test */
    public function verify_payment_rejects_wrong_signature()
    {
        Order::create([
            'order_id'       => 'order_rzp003',
            'user_id'        => $this->user->id,
            'plan_slug'      => 'pro',
            'plan_name'      => 'Pro',
            'period'         => 'monthly',
            'base_price'     => 999,
            'gst_amount'     => 179.82,
            'discount_amount'=> 0,
            'total_amount'   => 1178.82,
            'currency'       => 'INR',
            'payment_status' => 'pending',
        ]);

        $this->mockRazorpaySignatureInvalid();

        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/payments/verify', [
                'razorpay_order_id'   => 'order_rzp003',
                'razorpay_payment_id' => 'pay_bad',
                'razorpay_signature'  => 'bad_sig',
            ]);

        $res->assertStatus(400)->assertJsonPath('success', false);

        // Order must NOT be marked completed
        $this->assertDatabaseHas('orders', [
            'order_id'       => 'order_rzp003',
            'payment_status' => 'pending',
        ]);
    }

    /** @test */
    public function verify_payment_enforces_order_ownership()
    {
        $otherUser = User::factory()->create();

        Order::create([
            'order_id'       => 'order_rzp004',
            'user_id'        => $otherUser->id, // belongs to someone else
            'plan_slug'      => 'pro',
            'plan_name'      => 'Pro',
            'period'         => 'monthly',
            'base_price'     => 999,
            'gst_amount'     => 179.82,
            'discount_amount'=> 0,
            'total_amount'   => 1178.82,
            'currency'       => 'INR',
            'payment_status' => 'pending',
        ]);

        $res = $this->actingAs($this->user, 'sanctum') // acts as THIS user
            ->postJson('/api/payments/verify', [
                'razorpay_order_id'   => 'order_rzp004',
                'razorpay_payment_id' => 'pay_x',
                'razorpay_signature'  => 'sig_x',
            ]);

        $res->assertStatus(404);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function mockRazorpayOrderCreate(string $orderId, int $amount): void
    {
        $mock = Mockery::mock('overload:' . Api::class);
        $mock->order = new class($orderId, $amount) {
            public function __construct(private string $id, private int $amount) {}
            public function create(array $data): array
            {
                return ['id' => $this->id, 'amount' => $this->amount, 'currency' => 'INR'];
            }
        };
    }

    private function mockRazorpaySignatureValid(): void
    {
        $mock = Mockery::mock('overload:' . Api::class);
        $mock->utility = new class {
            public function verifyPaymentSignature(array $attrs): void {} // no-op = valid
        };
    }

    private function mockRazorpaySignatureInvalid(): void
    {
        $mock = Mockery::mock('overload:' . Api::class);
        $mock->utility = new class {
            public function verifyPaymentSignature(array $attrs): void
            {
                throw new \Razorpay\Api\Errors\SignatureVerificationError('Bad signature');
            }
        };
    }
}
