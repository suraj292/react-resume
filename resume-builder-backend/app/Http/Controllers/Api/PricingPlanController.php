<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricingPlan;

class PricingPlanController extends Controller
{
    /**
     * Get all active pricing plans
     */
    public function index()
    {
        $plans = PricingPlan::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($plan) {
                // Count accessible templates for this plan
                $templateCount = \App\Models\ResumeTemplate::active()
                    ->forPlanTier($plan->slug)
                    ->count();
                
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'tier' => $plan->slug,
                    'description' => $plan->description,
                    'currency' => $plan->currency,
                    'features' => collect($plan->features)->map(function ($feature) {
                        // If feature is already an object/array with text and included
                        if (is_array($feature) && isset($feature['text'])) {
                            return $feature;
                        }
                        // Otherwise, convert string to object format
                        return [
                            'text' => $feature,
                            'included' => true,
                        ];
                    })->toArray(),
                    'is_popular' => $plan->is_popular,
                    'button_text' => $plan->button_text,
                    'button_link' => $plan->button_link,
                    'badge_text' => $plan->badge_text,
                    'theme' => $plan->theme,
                    'pricing' => [
                        'usd' => [
                            'monthly' => $plan->monthly_price_usd,
                            'yearly' => $plan->yearly_price_usd,
                            'formatted_monthly' => $plan->getFormattedPrice('USD', 'monthly'),
                            'formatted_yearly' => $plan->getFormattedPrice('USD', 'yearly'),
                        ],
                        'inr' => [
                            'monthly' => $plan->monthly_price_inr,
                            'yearly' => $plan->yearly_price_inr,
                            'formatted_monthly' => $plan->getFormattedPrice('INR', 'monthly'),
                            'formatted_yearly' => $plan->getFormattedPrice('INR', 'yearly'),
                        ],
                        'eur' => [
                            'monthly' => $plan->monthly_price_eur,
                            'yearly' => $plan->yearly_price_eur,
                            'formatted_monthly' => $plan->getFormattedPrice('EUR', 'monthly'),
                            'formatted_yearly' => $plan->getFormattedPrice('EUR', 'yearly'),
                        ],
                    ],
                    'limits' => [
                        'max_resumes' => $plan->max_resumes,
                        'max_templates' => $plan->max_templates,
                        'template_count' => $templateCount,
                        'max_downloads_per_month' => $plan->max_downloads_per_month,
                        'max_ai_requests_per_month' => $plan->max_ai_requests_per_month,
                        'can_export_pdf' => $plan->can_export_pdf,
                        'can_export_docx' => $plan->can_export_docx,
                    ],
                ];
            });

        return response()->json($plans);
    }
}
