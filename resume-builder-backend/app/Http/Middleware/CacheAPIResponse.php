<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

/**
 * API Response Cache Middleware
 * 
 * Caches GET API responses to reduce database queries
 */
class CacheAPIResponse
{
    /**
     * Cache durations for different endpoints (in seconds)
     */
    private const CACHE_DURATIONS = [
        'seo' => 86400,          // 24 hours
        'pricing-plans' => 1800,  // 30 minutes
        'templates' => 1800,      // 30 minutes
        'blog' => 300,            // 5 minutes
        'contact/settings' => 3600, // 1 hour
    ];

    /**
     * Endpoints that should never be cached
     */
    private const BYPASS_CACHE = [
        'auth',
        'resumes',
        'user',
        'payments',
        'uploads',
        'ats/analyze',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        // Check if endpoint should bypass cache
        $path = $request->path();
        foreach (self::BYPASS_CACHE as $bypass) {
            if (str_contains($path, $bypass)) {
                return $next($request);
            }
        }

        // Generate cache key
        $cacheKey = $this->generateCacheKey($request);

        // Try to get from cache
        $cachedResponse = Cache::get($cacheKey);
        if ($cachedResponse) {
            \Log::info("[Cache HIT] {$path}");
            
            return response()->json($cachedResponse)
                ->header('X-Cache-Status', 'HIT')
                ->header('X-Cache-Key', $cacheKey);
        }

        // Get response from controller
        $response = $next($request);

        // Only cache successful JSON responses
        if ($response->isSuccessful() && $response->headers->get('Content-Type') === 'application/json') {
            $duration = $this->getCacheDuration($path);
            
            if ($duration > 0) {
                $content = json_decode($response->getContent(), true);
                Cache::put($cacheKey, $content, $duration);
                
                \Log::info("[Cache MISS] {$path} - cached for {$duration}s");
                
                $response->header('X-Cache-Status', 'MISS');
                $response->header('X-Cache-Key', $cacheKey);
                $response->header('X-Cache-TTL', $duration);
            }
        }

        return $response;
    }

    /**
     * Generate cache key from request
     */
    private function generateCacheKey(Request $request): string
    {
        $path = $request->path();
        $query = $request->query();
        
        // Sort query parameters for consistent cache keys
        ksort($query);
        
        $queryString = http_build_query($query);
        
        return 'api_cache:' . md5($path . $queryString);
    }

    /**
     * Get cache duration for a given path
     */
    private function getCacheDuration(string $path): int
    {
        foreach (self::CACHE_DURATIONS as $pattern => $duration) {
            if (str_contains($path, $pattern)) {
                return $duration;
            }
        }

        // Default: no cache
        return 0;
    }
}
