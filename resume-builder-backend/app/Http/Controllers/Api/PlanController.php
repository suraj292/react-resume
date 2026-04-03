<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PlanAccessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function __construct(private PlanAccessService $planService) {}

    /**
     * GET /api/plan/current
     * Returns plan, limits AND subscription summary in a single call.
     */
    public function getCurrentPlan(Request $request): JsonResponse
    {
        $user  = $request->user();
        $plan  = $user->getCurrentPlan();
        $limits = $user->getPlanLimits();

        return response()->json([
            'plan'         => $plan ? [
                'id'          => $plan->id,
                'name'        => $plan->name,
                'slug'        => $plan->slug,
                'description' => $plan->description,
                'features'    => $plan->features,
            ] : null,
            'limits'       => $limits,
            'subscription' => $this->planService->getSubscriptionSummary($user),
        ]);
    }

    /**
     * GET /api/plan/check/{feature}
     */
    public function checkFeatureAccess(Request $request, string $feature): JsonResponse
    {
        $user = $request->user();

        $canAccess = match ($feature) {
            'resume'        => $user->canCreateResume(),
            'download_pdf'  => $user->canDownload('pdf'),
            'download_docx' => $user->canDownload('docx'),
            'ai'            => $user->canUseAI(),
            default         => false,
        };

        return response()->json([
            'feature'    => $feature,
            'can_access' => $canAccess,
            'limits'     => $user->getPlanLimits(),
        ]);
    }

    /**
     * GET /api/plan/usage
     */
    public function getUsageStats(Request $request): JsonResponse
    {
        $user = $request->user();

        $resumeCount    = $user->resumes()->count();
        $downloadsMonth = $user->downloads()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $aiMonth = $user->aiRequests()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return response()->json([
            'resumes'     => [
                'total'       => $resumeCount,
                'by_template' => $user->resumes()
                    ->selectRaw('template_id, COUNT(*) as count')
                    ->groupBy('template_id')
                    ->get(),
            ],
            'downloads'   => [
                'this_month' => $downloadsMonth,
                'by_format'  => $user->downloads()
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->selectRaw('format, COUNT(*) as count')
                    ->groupBy('format')
                    ->get(),
            ],
            'ai_requests' => [
                'this_month' => $aiMonth,
                'by_type'    => $user->aiRequests()
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->selectRaw('type, COUNT(*) as count')
                    ->groupBy('type')
                    ->get(),
            ],
        ]);
    }
}
