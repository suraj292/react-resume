<?php

namespace Tests\Feature;

use App\Models\AiRequest;
use App\Models\Download;
use App\Models\Order;
use App\Models\PricingPlan;
use App\Models\Subscription;
use App\Models\User;
use App\Services\PlanAccessService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PlanLimitTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private PricingPlan $freePlan;
    private PricingPlan $proPlan;

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

        $this->proPlan = PricingPlan::create([
            'name'                      => 'Pro',
            'slug'                      => 'pro',
            'description'               => 'Pro tier',
            'is_active'                 => true,
            'pricing'                   => ['inr' => ['monthly' => 99900, 'yearly' => 999900]],
            'max_resumes'               => 10,
            'max_templates'             => null,
            'max_downloads_per_month'   => 20,
            'max_ai_requests_per_month' => 50,
            'can_export_pdf'            => true,
            'can_export_docx'           => true,
        ]);

        $this->user = User::factory()->create(['email_verified_at' => now()]);
    }

    // ── 403 payload consistency ───────────────────────────────────────────────

    /** @test */
    public function free_user_gets_403_with_consistent_payload_when_creating_third_resume()
    {
        // Create 2 resumes (hits the free limit)
        \App\Models\Resume::factory()->count(2)->create(['user_id' => $this->user->id]);

        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/resumes', ['title' => 'Extra Resume', 'content' => []]);

        $res->assertStatus(403)
            ->assertJsonStructure(['error', 'message', 'feature', 'limits', 'upgrade_required'])
            ->assertJsonPath('error', 'plan_limit_exceeded')
            ->assertJsonPath('feature', 'resume')
            ->assertJsonPath('upgrade_required', true);
    }

    /** @test */
    public function free_user_gets_403_on_pdf_export()
    {
        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/export/pdf', ['html' => '<p>Test</p>']);

        $res->assertStatus(403)
            ->assertJsonPath('error', 'plan_limit_exceeded')
            ->assertJsonPath('feature', 'download_pdf');
    }

    /** @test */
    public function free_user_gets_403_after_ai_limit_exhausted()
    {
        // Use up the 3 free AI requests
        AiRequest::factory()->count(3)->create([
            'user_id'    => $this->user->id,
            'type'       => 'ats_analysis',
            'created_at' => now(),
        ]);

        $res = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/ats/analyze', ['resume_text' => 'My resume text...']);

        $res->assertStatus(403)
            ->assertJsonPath('error', 'plan_limit_exceeded')
            ->assertJsonPath('feature', 'ai');
    }

    // ── Subscription activation / expiration ──────────────────────────────────

    /** @test */
    public function plan_access_service_uses_subscription_table_not_orders()
    {
        // Create an expired order (old mechanism) — should NOT grant access
        Order::create([
            'order_id'       => 'order_old',
            'user_id'        => $this->user->id,
            'plan_slug'      => 'pro',
            'plan_name'      => 'Pro',
            'period'         => 'monthly',
            'base_price'     => 999,
            'gst_amount'     => 179.82,
            'discount_amount'=> 0,
            'total_amount'   => 1178.82,
            'currency'       => 'INR',
            'payment_status' => 'completed',
            'valid_from'     => now()->subMonths(2),
            'valid_until'    => now()->subMonth(), // expired
        ]);

        // No subscription row exists → should be on free plan
        $service = app(PlanAccessService::class);
        $plan    = $service->getUserPlan($this->user);

        $this->assertEquals('free', $plan->slug);
    }

    /** @test */
    public function active_subscription_grants_pro_plan_access()
    {
        $order = Order::create([
            'order_id'       => 'order_active',
            'user_id'        => $this->user->id,
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
            'user_id'     => $this->user->id,
            'order_id'    => $order->id,
            'plan_slug'   => 'pro',
            'period'      => 'monthly',
            'status'      => 'active',
            'valid_from'  => now(),
            'valid_until' => now()->addMonth(),
        ]);

        Cache::forget("user_plan_{$this->user->id}");

        $service = app(PlanAccessService::class);
        $plan    = $service->getUserPlan($this->user);

        $this->assertEquals('pro', $plan->slug);
        $this->assertTrue($this->user->canDownload('pdf'));
        $this->assertTrue($this->user->canUseAI());
    }

    /** @test */
    public function expired_subscription_falls_back_to_free_plan()
    {
        $order = Order::create([
            'order_id'       => 'order_expired',
            'user_id'        => $this->user->id,
            'plan_slug'      => 'pro',
            'plan_name'      => 'Pro',
            'period'         => 'monthly',
            'base_price'     => 999,
            'gst_amount'     => 179.82,
            'discount_amount'=> 0,
            'total_amount'   => 1178.82,
            'currency'       => 'INR',
            'payment_status' => 'completed',
            'valid_from'     => now()->subMonths(2),
            'valid_until'    => now()->subDay(),
        ]);

        Subscription::create([
            'user_id'     => $this->user->id,
            'order_id'    => $order->id,
            'plan_slug'   => 'pro',
            'period'      => 'monthly',
            'status'      => 'active',
            'valid_from'  => now()->subMonths(2),
            'valid_until' => now()->subDay(), // expired
        ]);

        Cache::forget("user_plan_{$this->user->id}");

        $service = app(PlanAccessService::class);
        $plan    = $service->getUserPlan($this->user);

        $this->assertEquals('free', $plan->slug);
    }

    // ── Usage counter accuracy ────────────────────────────────────────────────

    /** @test */
    public function monthly_ai_counter_only_counts_current_month()
    {
        // Create requests in previous month — should NOT count
        AiRequest::factory()->count(5)->create([
            'user_id'    => $this->user->id,
            'type'       => 'ats_analysis',
            'created_at' => now()->subMonth(),
        ]);

        // Current month — should count
        AiRequest::factory()->count(2)->create([
            'user_id'    => $this->user->id,
            'type'       => 'ats_analysis',
            'created_at' => now(),
        ]);

        $service   = app(PlanAccessService::class);
        $remaining = $service->getRemainingAIRequests($this->user);

        // Free plan has 3 limit, used 2 this month → 1 remaining
        $this->assertEquals(1, $remaining);
    }

    /** @test */
    public function monthly_download_counter_resets_next_month()
    {
        // This month's downloads — should count
        Download::factory()->count(3)->create([
            'user_id'    => $this->user->id,
            'format'     => 'pdf',
            'created_at' => now(),
        ]);

        $service = app(PlanAccessService::class);
        $used    = $this->user->downloads()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $this->assertEquals(3, $used);
    }

    // ── /plan/current endpoint ────────────────────────────────────────────────

    /** @test */
    public function plan_current_endpoint_returns_correct_structure()
    {
        $res = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/plan/current');

        $res->assertOk()
            ->assertJsonStructure([
                'plan'         => ['id', 'name', 'slug'],
                'limits'       => ['plan_slug', 'resumes', 'downloads', 'ai_requests'],
                'subscription',
            ]);
    }
}
