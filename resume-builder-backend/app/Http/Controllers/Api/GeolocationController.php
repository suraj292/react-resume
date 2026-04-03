<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeolocationController extends Controller
{
    private const DEFAULT_RESPONSE = ['country' => 'US', 'currency' => 'USD'];
    private const LOCAL_IPS        = ['127.0.0.1', '::1'];
    private const CACHE_TTL        = 3600 * 24; // 24 hours per IP

    /**
     * ISO 3166-1 alpha-2 → currency code mapping.
     */
    private const CURRENCY_MAP = [
        'IN'  => 'INR',
        // Eurozone
        'AT'  => 'EUR', 'BE' => 'EUR', 'CY' => 'EUR', 'EE' => 'EUR',
        'FI'  => 'EUR', 'FR' => 'EUR', 'DE' => 'EUR', 'GR' => 'EUR',
        'IE'  => 'EUR', 'IT' => 'EUR', 'LV' => 'EUR', 'LT' => 'EUR',
        'LU'  => 'EUR', 'MT' => 'EUR', 'NL' => 'EUR', 'PT' => 'EUR',
        'SK'  => 'EUR', 'SI' => 'EUR', 'ES' => 'EUR',
    ];

    /**
     * Detect currency from the client IP.
     * Result is cached per-IP for 24 h; graceful fallback to USD.
     */
    public function detectCurrency(Request $request)
    {
        $ip = $request->ip();

        // Localhost → use INR for local development convenience
        if (in_array($ip, self::LOCAL_IPS, true)) {
            return response()->json([
                'country'  => 'IN',
                'currency' => 'INR',
                'source'   => 'local',
            ]);
        }

        $cacheKey = "geo_currency_{$ip}";

        $result = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($ip) {
            return $this->resolveFromProviders($ip);
        });

        return response()->json(array_merge($result, ['ip' => $ip]));
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private function resolveFromProviders(string $ip): array
    {
        // Primary: ipapi.co (1 000 req/day free)
        try {
            $response = Http::timeout(3)->get("https://ipapi.co/{$ip}/json/");

            if ($response->successful()) {
                $countryCode = $response->json('country_code', 'US');
                return [
                    'country'  => $countryCode,
                    'currency' => self::CURRENCY_MAP[$countryCode] ?? 'USD',
                    'source'   => 'ipapi.co',
                ];
            }
        } catch (\Exception $e) {
            Log::warning('geo.primary_provider_failed', [
                'provider' => 'ipapi.co',
                'ip'       => substr($ip, 0, 8) . '***', // partial for privacy
                'error'    => $e->getMessage(),
            ]);
        }

        // Fallback: ip-api.com (free, no key required)
        try {
            $response = Http::timeout(3)->get("http://ip-api.com/json/{$ip}?fields=status,countryCode");

            if ($response->successful() && $response->json('status') === 'success') {
                $countryCode = $response->json('countryCode', 'US');
                return [
                    'country'  => $countryCode,
                    'currency' => self::CURRENCY_MAP[$countryCode] ?? 'USD',
                    'source'   => 'ip-api.com',
                ];
            }
        } catch (\Exception $e) {
            Log::warning('geo.fallback_provider_failed', [
                'provider' => 'ip-api.com',
                'error'    => $e->getMessage(),
            ]);
        }

        Log::info('geo.all_providers_failed', ['ip_prefix' => substr($ip, 0, 8) . '***']);
        return array_merge(self::DEFAULT_RESPONSE, ['source' => 'default']);
    }
}
