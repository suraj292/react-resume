<?php

namespace App\Services;

use App\Models\PricingPlan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PlanAccessService
{
    /**
     * Get the user's active subscription (from subscriptions table, not orders).
     */
    public function getActiveSubscription(User $user): ?Subscription
    {
        return Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('valid_until')
                    ->orWhere('valid_until', '>', now());
            })
            ->latest()
            ->first();
    }

    /**
     * Get the user's current PricingPlan (cached, falls back to free plan).
     */
    public function getUserPlan(User $user): ?PricingPlan
    {
        $cacheKey = "user_plan_{$user->id}";

        return Cache::remember($cacheKey, now()->addHour(), function () use ($user) {
            $sub = $this->getActiveSubscription($user);

            if (!$sub) {
                return $this->getFreePlan();
            }

            return PricingPlan::where('slug', $sub->plan_slug)->first()
                ?? $this->getFreePlan();
        });
    }

    /**
     * Get the free plan.
     */
    public function getFreePlan(): ?PricingPlan
    {
        return Cache::remember('free_plan', now()->addDay(), function () {
            return PricingPlan::where('slug', 'free')->first();
        });
    }

    // ── Feature gates ────────────────────────────────────────────────────────

    public function canCreateResume(User $user): bool
    {
        $plan = $this->getUserPlan($user);
        if (!$plan || $plan->max_resumes === null) {
            return true;
        }
        return $user->resumes()->count() < $plan->max_resumes;
    }

    public function getRemainingResumes(User $user): int|string
    {
        $plan = $this->getUserPlan($user);
        if (!$plan || $plan->max_resumes === null) {
            return 'unlimited';
        }
        return max(0, $plan->max_resumes - $user->resumes()->count());
    }

    public function canAccessTemplate(User $user, string $templateId): bool
    {
        $plan = $this->getUserPlan($user);
        if (!$plan) {
            return false;
        }
        $template = \App\Models\ResumeTemplate::where('template_id', $templateId)->first();
        return $template && $template->isAccessibleByPlan($plan->slug);
    }

    public function getAccessibleTemplates(User $user): array
    {
        $plan = $this->getUserPlan($user) ?? $this->getFreePlan();
        return \App\Models\ResumeTemplate::active()
            ->forPlanTier($plan->slug)
            ->pluck('template_id')
            ->toArray();
    }

    public function getAccessibleTemplateCount(User $user): int|string
    {
        $plan = $this->getUserPlan($user);
        if (!$plan || $plan->max_templates === null) {
            return 'unlimited';
        }
        return \App\Models\ResumeTemplate::active()
            ->forPlanTier($plan->slug)
            ->count();
    }

    public function canDownload(User $user, string $format = 'pdf'): bool
    {
        $plan = $this->getUserPlan($user);
        if (!$plan) {
            return false;
        }

        $canExport = $format === 'pdf' ? $plan->can_export_pdf : $plan->can_export_docx;
        if (!$canExport) {
            return false;
        }

        if ($plan->max_downloads_per_month === null) {
            return true;
        }

        return $this->downloadsThisMonth($user) < $plan->max_downloads_per_month;
    }

    public function getRemainingDownloads(User $user): int|string
    {
        $plan = $this->getUserPlan($user);
        if (!$plan || $plan->max_downloads_per_month === null) {
            return 'unlimited';
        }
        return max(0, $plan->max_downloads_per_month - $this->downloadsThisMonth($user));
    }

    public function canUseAI(User $user): bool
    {
        $plan = $this->getUserPlan($user);
        if (!$plan) {
            return false;
        }
        if ($plan->max_ai_requests_per_month === null) {
            return true;
        }
        return $this->aiRequestsThisMonth($user) < $plan->max_ai_requests_per_month;
    }

    public function getRemainingAIRequests(User $user): int|string
    {
        $plan = $this->getUserPlan($user);
        if (!$plan || $plan->max_ai_requests_per_month === null) {
            return 'unlimited';
        }
        return max(0, $plan->max_ai_requests_per_month - $this->aiRequestsThisMonth($user));
    }

    /**
     * Full plan + usage summary used by /plan/current and /auth/me.
     */
    public function getPlanLimits(User $user): array
    {
        $plan = $this->getUserPlan($user);

        if (!$plan) {
            return $this->emptyLimits();
        }

        $resumeCount    = $user->resumes()->count();
        $downloadsMonth = $this->downloadsThisMonth($user);
        $aiMonth        = $this->aiRequestsThisMonth($user);

        return [
            'plan_name'       => $plan->name,
            'plan_slug'       => $plan->slug,
            'resumes'         => [
                'limit'     => $plan->max_resumes ?? 'unlimited',
                'used'      => $resumeCount,
                'remaining' => $this->getRemainingResumes($user),
            ],
            'templates'       => [
                'limit'      => $plan->max_templates ?? 'unlimited',
                'accessible' => $this->getAccessibleTemplateCount($user),
            ],
            'downloads'       => [
                'limit'     => $plan->max_downloads_per_month ?? 'unlimited',
                'used'      => $downloadsMonth,
                'remaining' => $this->getRemainingDownloads($user),
            ],
            'ai_requests'     => [
                'limit'     => $plan->max_ai_requests_per_month ?? 'unlimited',
                'used'      => $aiMonth,
                'remaining' => $this->getRemainingAIRequests($user),
            ],
            'can_export_pdf'  => $plan->can_export_pdf,
            'can_export_docx' => $plan->can_export_docx,
        ];
    }

    /**
     * Build a subscription summary for API responses.
     */
    public function getSubscriptionSummary(User $user): ?array
    {
        $sub = $this->getActiveSubscription($user);
        if (!$sub) {
            return null;
        }

        return [
            'plan_slug'   => $sub->plan_slug,
            'period'      => $sub->period,
            'status'      => $sub->status,
            'valid_from'  => $sub->valid_from?->toIso8601String(),
            'valid_until' => $sub->valid_until?->toIso8601String(),
            'is_active'   => $sub->isActive(),
        ];
    }

    /**
     * Invalidate user plan cache after payment or cancellation.
     */
    public function clearUserPlanCache(User $user): void
    {
        Cache::forget("user_plan_{$user->id}");

        Log::info('plan.cache_cleared', ['user_id' => $user->id]);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function downloadsThisMonth(User $user): int
    {
        return $user->downloads()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
    }

    private function aiRequestsThisMonth(User $user): int
    {
        return $user->aiRequests()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
    }

    private function emptyLimits(): array
    {
        return [
            'plan_name'       => 'Free',
            'plan_slug'       => 'free',
            'resumes'         => ['limit' => 0, 'used' => 0, 'remaining' => 0],
            'templates'       => ['limit' => 0, 'accessible' => 0],
            'downloads'       => ['limit' => 0, 'used' => 0, 'remaining' => 0],
            'ai_requests'     => ['limit' => 0, 'used' => 0, 'remaining' => 0],
            'can_export_pdf'  => false,
            'can_export_docx' => false,
        ];
    }
}
