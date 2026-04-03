<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\PricingPlan;
use App\Models\Subscription;
use App\Models\Order;
use App\Services\PlanAccessService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private PricingPlan $freePlan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->freePlan = PricingPlan::create([
            'name'                      => 'Free',
            'slug'                      => 'free',
            'description'               => 'Free tier',
            'is_active'                 => true,
            'pricing'                   => ['inr' => ['monthly' => 0, 'yearly' => 0]],
            'max_resumes'               => 2,
            'max_templates'             => 3,
            'max_downloads_per_month'   => 0,
            'max_ai_requests_per_month' => 3,
            'can_export_pdf'            => false,
            'can_export_docx'           => false,
        ]);
    }

    // ── /api/auth/login ──────────────────────────────────────────────────────

    /** @test */
    public function login_returns_standardised_user_payload_with_plan()
    {
        $user = User::factory()->create([
            'email'    => 'test@example.com',
            'password' => bcrypt('Password1'),
        ]);

        $res = $this->postJson('/api/auth/login', [
            'email'    => 'test@example.com',
            'password' => 'Password1',
        ]);

        $res->assertOk()
            ->assertJsonStructure([
                'user' => [
                    'id', 'name', 'email', 'email_verified_at', 'avatar',
                    'currency_preference',
                    'plan'         => ['slug', 'name'],
                    'subscription',
                    'limits'       => ['plan_slug', 'resumes', 'ai_requests'],
                ],
                'token',
            ])
            ->assertJsonPath('user.plan.slug', 'free');
    }

    /** @test */
    public function me_returns_updated_plan_after_subscription_activated()
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $proPlan = PricingPlan::create([
            'name'     => 'Pro',
            'slug'     => 'pro',
            'is_active'=> true,
            'pricing'  => ['inr' => ['monthly' => 99900]],
            'can_export_pdf'  => true,
            'can_export_docx' => true,
        ]);

        $order = Order::create([
            'order_id'       => 'order_me_test',
            'user_id'        => $user->id,
            'plan_slug'      => 'pro',
            'plan_name'      => 'Pro',
            'period'         => 'monthly',
            'base_price'     => 999,
            'gst_amount'     => 179.82,
            'discount_amount'=> 0,
            'total_amount'   => 1178.82,
            'currency'       => 'INR',
            'payment_status' => 'completed',
            'valid_from'     => now(),
            'valid_until'    => now()->addMonth(),
        ]);

        Subscription::create([
            'user_id'     => $user->id,
            'order_id'    => $order->id,
            'plan_slug'   => 'pro',
            'period'      => 'monthly',
            'status'      => 'active',
            'valid_from'  => now(),
            'valid_until' => now()->addMonth(),
        ]);

        Cache::forget("user_plan_{$user->id}");

        $token = $user->createToken('test')->plainTextToken;

        $res = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/auth/me');

        $res->assertOk()
            ->assertJsonPath('user.plan.slug', 'pro')
            ->assertJsonPath('user.subscription.status', 'active');
    }

    /** @test */
    public function me_returns_401_with_invalid_token()
    {
        $res = $this->withHeader('Authorization', 'Bearer invalid_token_here')
            ->getJson('/api/auth/me');

        $res->assertStatus(401);
    }

    /** @test */
    public function login_response_includes_currency_preference()
    {
        $user = User::factory()->create([
            'email'               => 'curr@example.com',
            'password'            => bcrypt('Password1'),
            'currency_preference' => 'USD',
        ]);

        $res = $this->postJson('/api/auth/login', [
            'email'    => 'curr@example.com',
            'password' => 'Password1',
        ]);

        $res->assertOk()
            ->assertJsonPath('user.currency_preference', 'USD');
    }
}
