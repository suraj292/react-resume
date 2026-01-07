<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    /**
     * Get the authenticated user's current plan and limits
     */
    public function getCurrentPlan(Request $request): JsonResponse
    {
        $user = $request->user();
        $plan = $user->getCurrentPlan();
        $limits = $user->getPlanLimits();
        
        return response()->json([
            'plan' => $plan ? [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'description' => $plan->description,
                'features' => $plan->features,
            ] : null,
            'limits' => $limits,
            'subscription' => $user->activeSubscription ? [
                'order_id' => $user->activeSubscription->order_id,
                'period' => $user->activeSubscription->period,
                'valid_from' => $user->activeSubscription->valid_from,
                'valid_until' => $user->activeSubscription->valid_until,
                'is_active' => $user->activeSubscription->isActive(),
            ] : null,
        ]);
    }

    /**
     * Check if user can access a specific feature
     */
    public function checkFeatureAccess(Request $request, string $feature): JsonResponse
    {
        $user = $request->user();
        
        $canAccess = match($feature) {
            'resume' => $user->canCreateResume(),
            'download_pdf' => $user->canDownload('pdf'),
            'download_docx' => $user->canDownload('docx'),
            'ai' => $user->canUseAI(),
            default => false,
        };
        
        return response()->json([
            'feature' => $feature,
            'can_access' => $canAccess,
            'limits' => $user->getPlanLimits(),
        ]);
    }

    /**
     * Get usage statistics for the current month
     */
    public function getUsageStats(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $resumeCount = $user->resumes()->count();
        $downloadsThisMonth = $user->downloads()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $aiRequestsThisMonth = $user->aiRequests()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        
        return response()->json([
            'resumes' => [
                'total' => $resumeCount,
                'by_template' => $user->resumes()
                    ->selectRaw('template_id, COUNT(*) as count')
                    ->groupBy('template_id')
                    ->get(),
            ],
            'downloads' => [
                'this_month' => $downloadsThisMonth,
                'by_format' => $user->downloads()
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->selectRaw('format, COUNT(*) as count')
                    ->groupBy('format')
                    ->get(),
            ],
            'ai_requests' => [
                'this_month' => $aiRequestsThisMonth,
                'by_type' => $user->aiRequests()
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->selectRaw('type, COUNT(*) as count')
                    ->groupBy('type')
                    ->get(),
            ],
        ]);
    }
}
