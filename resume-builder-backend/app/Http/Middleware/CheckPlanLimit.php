<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPlanLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated'
            ], 401);
        }
        
        $canAccess = match($feature) {
            'resume' => $user->canCreateResume(),
            'download_pdf' => $user->canDownload('pdf'),
            'download_docx' => $user->canDownload('docx'),
            'ai' => $user->canUseAI(),
            default => false,
        };
        
        if (!$canAccess) {
            $limits = $user->getPlanLimits();
            
            return response()->json([
                'error' => 'Plan limit reached',
                'message' => $this->getErrorMessage($feature, $limits),
                'limits' => $limits,
                'upgrade_required' => true,
            ], 403);
        }
        
        return $next($request);
    }
    
    /**
     * Get appropriate error message based on feature
     */
    private function getErrorMessage(string $feature, array $limits): string
    {
        return match($feature) {
            'resume' => "You've reached your plan's resume limit ({$limits['resumes']['limit']}). Upgrade to create more resumes.",
            'download_pdf' => "You've reached your monthly download limit ({$limits['downloads']['limit']}). Upgrade for more downloads.",
            'download_docx' => "DOCX export is not available in your current plan. Upgrade to unlock this feature.",
            'ai' => "You've reached your monthly AI request limit ({$limits['ai_requests']['limit']}). Upgrade for more AI features.",
            default => 'This feature is not available in your current plan.',
        };
    }
}
