<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeolocationController extends Controller
{
    /**
     * Detect currency based on user's IP address
     */
    public function detectCurrency(Request $request)
    {
        $ip = $request->ip();
        
        // For local development, use a default
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return response()->json([
                'country' => 'IN',
                'currency' => 'INR',
                'ip' => $ip,
            ]);
        }
        
        try {
            // Use ipapi.co free service (1000 requests/day)
            $response = Http::timeout(3)->get("https://ipapi.co/{$ip}/json/");
            
            if ($response->successful()) {
                $data = $response->json();
                $countryCode = $data['country_code'] ?? 'US';
                
                // Map country to currency
                $currency = match($countryCode) {
                    'IN' => 'INR', // India
                    // European Union countries
                    'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 
                    'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES' => 'EUR',
                    default => 'USD', // Rest of the world
                };
                
                return response()->json([
                    'country' => $countryCode,
                    'currency' => $currency,
                    'ip' => $ip,
                ]);
            }
        } catch (\Exception $e) {
            // Log error but don't expose to user
            \Log::warning('Geolocation API failed', ['error' => $e->getMessage()]);
        }
        
        // Default to USD if geolocation fails
        return response()->json([
            'country' => 'US',
            'currency' => 'USD',
            'ip' => $ip,
        ]);
    }
}
