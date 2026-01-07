<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserStatsController extends Controller
{
    /**
     * Get user statistics
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'resumes_count' => $user->resumes()->count(),
            'downloads_count' => $user->downloads()->count(),
            'ai_requests_count' => $user->aiRequests()->count(),
            'member_since' => $user->created_at->format('Y-m-d'),
        ]);
    }
}
