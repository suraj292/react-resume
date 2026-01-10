<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RevalidateController extends Controller
{
    /**
     * Handle revalidation requests from frontend
     * This endpoint is used to clear caches when content is updated
     * 
     * POST /api/revalidate
     * Body: { path: '/pricing' } or { tag: 'pricing' } or { paths: [...] } or { tags: [...] }
     * Headers: Authorization: Bearer <REVALIDATE_SECRET>
     */
    public function revalidate(Request $request)
    {
        // Check authorization
        $token = $request->bearerToken();
        
        if ($token !== config('app.revalidate_secret')) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        $validated = $request->validate([
            'path' => 'nullable|string',
            'tag' => 'nullable|string',
            'paths' => 'nullable|array',
            'paths.*' => 'string',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
        ]);

        $clearedItems = [];

        // Clear cache by path
        if (isset($validated['path'])) {
            $cacheKey = 'page:' . $validated['path'];
            Cache::forget($cacheKey);
            $clearedItems[] = $validated['path'];
            Log::info("[Cache] Cleared cache for path: {$validated['path']}");
        }

        // Clear cache by tag
        if (isset($validated['tag'])) {
            Cache::tags($validated['tag'])->flush();
            $clearedItems[] = "tag:{$validated['tag']}";
            Log::info("[Cache] Cleared cache for tag: {$validated['tag']}");
        }

        // Clear multiple paths
        if (isset($validated['paths'])) {
            foreach ($validated['paths'] as $path) {
                $cacheKey = 'page:' . $path;
                Cache::forget($cacheKey);
                $clearedItems[] = $path;
                Log::info("[Cache] Cleared cache for path: {$path}");
            }
        }

        // Clear multiple tags
        if (isset($validated['tags'])) {
            foreach ($validated['tags'] as $tag) {
                Cache::tags($tag)->flush();
                $clearedItems[] = "tag:{$tag}";
                Log::info("[Cache] Cleared cache for tag: {$tag}");
            }
        }

        if (empty($clearedItems)) {
            return response()->json([
                'error' => 'Missing path, tag, paths, or tags parameter'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cache cleared successfully',
            'cleared' => $clearedItems,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Health check endpoint
     * 
     * GET /api/revalidate
     */
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Revalidation API is running',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
