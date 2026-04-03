<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckPlanLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  string  $feature  resume | download_pdf | download_docx | ai
     */
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error'   => 'Unauthenticated',
                'message' => 'You must be logged in to access this resource.',
            ], 401);
        }

        $canAccess = match ($feature) {
            'resume'        => $user->canCreateResume(),
            'download_pdf'  => $user->canDownload('pdf'),
            'download_docx' => $user->canDownload('docx'),
            'ai'            => $user->canUseAI(),
            default         => false,
        };

        if (!$canAccess) {
            $limits = $user->getPlanLimits();
            $message = $this->getErrorMessage($feature, $limits);

            Log::info('plan.limit_reached', [
                'user_id'  => $user->id,
                'feature'  => $feature,
                'plan'     => $limits['plan_slug'] ?? 'unknown',
            ]);

            return response()->json([
                'error'            => 'plan_limit_exceeded',
                'message'          => $message,
                'feature'          => $feature,
                'limits'           => $limits,
                'upgrade_required' => true,
            ], 403);
        }

        return $next($request);
    }

    private function getErrorMessage(string $feature, array $limits): string
    {
        return match ($feature) {
            'resume'       => "You've reached your plan's resume limit ({$limits['resumes']['limit']}). Upgrade to create more.",
            'download_pdf' => "You've reached your monthly download limit ({$limits['downloads']['limit']}). Upgrade for more downloads.",
            'download_docx'=> "DOCX export is not available on your current plan. Upgrade to unlock.",
            'ai'           => "You've reached your monthly AI request limit ({$limits['ai_requests']['limit']}). Upgrade for more AI features.",
            default        => 'This feature is not available on your current plan.',
        };
    }
}
