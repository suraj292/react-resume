<?php

namespace App\Services;

use App\Models\User;
use App\Models\PricingPlan;
use Illuminate\Support\Facades\Cache;

class PlanAccessService
{
    /**
     * Get the user's current plan
     */
    public function getUserPlan(User $user): ?PricingPlan
    {
        $activeOrder = $user->activeSubscription;
        
        if (!$activeOrder) {
            return $this->getFreePlan();
        }
        
        return Cache::remember(
            "user_plan_{$user->id}",
            now()->addHours(1),
            fn() => PricingPlan::where('slug', $activeOrder->plan_slug)->first() ?? $this->getFreePlan()
        );
    }

    /**
     * Get the free plan (default)
     */
    public function getFreePlan(): ?PricingPlan
    {
        return Cache::remember(
            'free_plan',
            now()->addDay(),
            fn() => PricingPlan::where('slug', 'free')->first()
        );
    }

    /**
     * Check if user can create more resumes
     */
    public function canCreateResume(User $user): bool
    {
        $plan = $this->getUserPlan($user);
        
        if (!$plan || $plan->max_resumes === null) {
            return true; // Unlimited
        }
        
        $currentCount = $user->resumes()->count();
        return $currentCount < $plan->max_resumes;
    }

    /**
     * Get remaining resume slots
     */
    public function getRemainingResumes(User $user): int|string
    {
        $plan = $this->getUserPlan($user);
        
        if (!$plan || $plan->max_resumes === null) {
            return 'unlimited';
        }
        
        $currentCount = $user->resumes()->count();
        return max(0, $plan->max_resumes - $currentCount);
    }

    /**
     * Check if user can access a specific template by template_id
     */
    public function canAccessTemplate(User $user, string $templateId): bool
    {
        $plan = $this->getUserPlan($user);
        
        if (!$plan) {
            return false;
        }
        
        $template = \App\Models\ResumeTemplate::where('template_id', $templateId)->first();
        
        if (!$template) {
            return false;
        }
        
        return $template->isAccessibleByPlan($plan->slug);
    }

    /**
     * Get accessible template IDs for user
     */
    public function getAccessibleTemplates(User $user): array
    {
        $plan = $this->getUserPlan($user);
        
        if (!$plan) {
            $plan = $this->getFreePlan();
        }
        
        return \App\Models\ResumeTemplate::active()
            ->forPlanTier($plan->slug)
            ->pluck('template_id')
            ->toArray();
    }

    /**
     * Get accessible template count
     */
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

    /**
     * Check if user can download (PDF/DOCX)
     */
    public function canDownload(User $user, string $format = 'pdf'): bool
    {
        $plan = $this->getUserPlan($user);
        
        if (!$plan) {
            return false;
        }
        
        // Check format permission
        $canExport = $format === 'pdf' ? $plan->can_export_pdf : $plan->can_export_docx;
        
        if (!$canExport) {
            return false;
        }
        
        // Check monthly download limit
        if ($plan->max_downloads_per_month === null) {
            return true; // Unlimited
        }
        
        $downloadsThisMonth = $user->downloads()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
            
        return $downloadsThisMonth < $plan->max_downloads_per_month;
    }

    /**
     * Get remaining downloads for this month
     */
    public function getRemainingDownloads(User $user): int|string
    {
        $plan = $this->getUserPlan($user);
        
        if (!$plan || $plan->max_downloads_per_month === null) {
            return 'unlimited';
        }
        
        $downloadsThisMonth = $user->downloads()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
            
        return max(0, $plan->max_downloads_per_month - $downloadsThisMonth);
    }

    /**
     * Check if user can use AI features (resume parsing, ATS checker)
     */
    public function canUseAI(User $user): bool
    {
        $plan = $this->getUserPlan($user);
        
        if (!$plan) {
            return false;
        }
        
        if ($plan->max_ai_requests_per_month === null) {
            return true; // Unlimited
        }
        
        $aiRequestsThisMonth = $user->aiRequests()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
            
        return $aiRequestsThisMonth < $plan->max_ai_requests_per_month;
    }

    /**
     * Get remaining AI requests for this month
     */
    public function getRemainingAIRequests(User $user): int|string
    {
        $plan = $this->getUserPlan($user);
        
        if (!$plan || $plan->max_ai_requests_per_month === null) {
            return 'unlimited';
        }
        
        $aiRequestsThisMonth = $user->aiRequests()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
            
        return max(0, $plan->max_ai_requests_per_month - $aiRequestsThisMonth);
    }

    /**
     * Get user's plan limits summary
     */
    public function getPlanLimits(User $user): array
    {
        $plan = $this->getUserPlan($user);
        
        if (!$plan) {
            return [
                'plan_name' => 'Free',
                'plan_slug' => 'free',
                'resumes' => ['limit' => 0, 'used' => 0, 'remaining' => 0],
                'templates' => ['limit' => 0, 'used' => 0, 'remaining' => 0],
                'downloads' => ['limit' => 0, 'used' => 0, 'remaining' => 0],
                'ai_requests' => ['limit' => 0, 'used' => 0, 'remaining' => 0],
                'can_export_pdf' => false,
                'can_export_docx' => false,
            ];
        }
        
        $resumeCount = $user->resumes()->count();
        $downloadsThisMonth = $user->downloads()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $aiRequestsThisMonth = $user->aiRequests()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        
        return [
            'plan_name' => $plan->name,
            'plan_slug' => $plan->slug,
            'resumes' => [
                'limit' => $plan->max_resumes ?? 'unlimited',
                'used' => $resumeCount,
                'remaining' => $this->getRemainingResumes($user),
            ],
            'templates' => [
                'limit' => $plan->max_templates ?? 'unlimited',
                'accessible' => $this->getAccessibleTemplateCount($user),
            ],
            'downloads' => [
                'limit' => $plan->max_downloads_per_month ?? 'unlimited',
                'used' => $downloadsThisMonth,
                'remaining' => $this->getRemainingDownloads($user),
            ],
            'ai_requests' => [
                'limit' => $plan->max_ai_requests_per_month ?? 'unlimited',
                'used' => $aiRequestsThisMonth,
                'remaining' => $this->getRemainingAIRequests($user),
            ],
            'can_export_pdf' => $plan->can_export_pdf,
            'can_export_docx' => $plan->can_export_docx,
        ];
    }

    /**
     * Clear user plan cache
     */
    public function clearUserPlanCache(User $user): void
    {
        Cache::forget("user_plan_{$user->id}");
    }
}
