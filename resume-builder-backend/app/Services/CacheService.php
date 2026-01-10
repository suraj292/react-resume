<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Cache Management Service
 * 
 * Centralized cache management with multi-layer invalidation
 */
class CacheService
{
    /**
     * Cache tags for organized cache management
     */
    public const TAGS = [
        'SEO' => 'seo',
        'PRICING' => 'pricing',
        'TEMPLATES' => 'templates',
        'BLOG' => 'blog',
        'CONTACT' => 'contact',
    ];

    /**
     * Clear cache by tag
     */
    public static function clearByTag(string $tag): bool
    {
        try {
            // Clear Laravel cache
            Cache::tags([$tag])->flush();
            \Log::info("[Cache] Cleared tag: {$tag}");

            // Trigger Next.js revalidation
            self::revalidateNextJS($tag);

            // Trigger Cloudflare cache purge
            self::purgeCloudflare($tag);

            return true;
        } catch (\Exception $e) {
            \Log::error("[Cache] Failed to clear tag {$tag}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Clear cache by pattern
     */
    public static function clearByPattern(string $pattern): bool
    {
        try {
            $keys = Cache::get('cache_keys', []);
            $cleared = 0;

            foreach ($keys as $key) {
                if (str_contains($key, $pattern)) {
                    Cache::forget($key);
                    $cleared++;
                }
            }

            \Log::info("[Cache] Cleared {$cleared} keys matching pattern: {$pattern}");
            return true;
        } catch (\Exception $e) {
            \Log::error("[Cache] Failed to clear pattern {$pattern}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Clear all API cache
     */
    public static function clearAll(): bool
    {
        try {
            Cache::flush();
            \Log::info("[Cache] Cleared all cache");

            // Trigger Next.js full revalidation
            self::revalidateNextJS('all');

            return true;
        } catch (\Exception $e) {
            \Log::error("[Cache] Failed to clear all cache: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get cache statistics
     */
    public static function getStats(): array
    {
        $keys = Cache::get('cache_keys', []);
        
        return [
            'total_keys' => count($keys),
            'tags' => array_keys(self::TAGS),
            'driver' => config('cache.default'),
        ];
    }

    /**
     * Warm up cache for critical endpoints
     */
    public static function warmUp(): bool
    {
        try {
            $endpoints = [
                '/api/seo/%2F',
                '/api/pricing-plans',
                '/api/templates',
                '/api/blog/categories',
            ];

            foreach ($endpoints as $endpoint) {
                $url = config('app.url') . $endpoint;
                Http::get($url);
                \Log::info("[Cache] Warmed up: {$endpoint}");
            }

            return true;
        } catch (\Exception $e) {
            \Log::error("[Cache] Failed to warm up cache: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Trigger Next.js revalidation
     */
    private static function revalidateNextJS(string $tag): void
    {
        try {
            $nextjsUrl = config('services.nextjs.url');
            $secret = config('services.nextjs.revalidate_secret');

            if (!$nextjsUrl || !$secret) {
                return;
            }

            Http::withHeaders([
                'Authorization' => "Bearer {$secret}",
            ])->post("{$nextjsUrl}/api/revalidate", [
                'tag' => $tag,
            ]);

            \Log::info("[Next.js] Revalidated tag: {$tag}");
        } catch (\Exception $e) {
            \Log::error("[Next.js] Failed to revalidate: " . $e->getMessage());
        }
    }

    /**
     * Purge Cloudflare cache
     */
    private static function purgeCloudflare(string $tag): void
    {
        try {
            $zoneId = config('services.cloudflare.zone_id');
            $apiToken = config('services.cloudflare.api_token');

            if (!$zoneId || !$apiToken) {
                return;
            }

            Http::withHeaders([
                'Authorization' => "Bearer {$apiToken}",
            ])->post("https://api.cloudflare.com/client/v4/zones/{$zoneId}/purge_cache", [
                'tags' => [$tag],
            ]);

            \Log::info("[Cloudflare] Purged tag: {$tag}");
        } catch (\Exception $e) {
            \Log::error("[Cloudflare] Failed to purge: " . $e->getMessage());
        }
    }

    /**
     * Remember data with automatic cache key tracking
     */
    public static function remember(string $key, int $ttl, callable $callback, array $tags = [])
    {
        // Track cache key
        $keys = Cache::get('cache_keys', []);
        if (!in_array($key, $keys)) {
            $keys[] = $key;
            Cache::forever('cache_keys', $keys);
        }

        // Cache with tags if supported
        if (!empty($tags) && config('cache.default') !== 'file') {
            return Cache::tags($tags)->remember($key, $ttl, $callback);
        }

        return Cache::remember($key, $ttl, $callback);
    }
}
