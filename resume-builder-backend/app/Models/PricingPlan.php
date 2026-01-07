<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'currency',
        'features',
        'is_popular',
        'is_active',
        'sort_order',
        'button_text',
        'button_link',
        'badge_text',
        'theme',
        // Multi-currency pricing
        'monthly_price_usd',
        'yearly_price_usd',
        'monthly_price_inr',
        'yearly_price_inr',
        'monthly_price_eur',
        'yearly_price_eur',
        // Feature limits
        'max_resumes',
        'max_templates',
        'max_downloads_per_month',
        'max_ai_requests_per_month',
        'can_export_pdf',
        'can_export_docx',
    ];

    protected $casts = [
        'features' => 'array',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        // Multi-currency prices
        'monthly_price_usd' => 'integer',
        'yearly_price_usd' => 'integer',
        'monthly_price_inr' => 'integer',
        'yearly_price_inr' => 'integer',
        'monthly_price_eur' => 'integer',
        'yearly_price_eur' => 'integer',
        // Feature limits
        'max_resumes' => 'integer',
        'max_templates' => 'integer',
        'max_downloads_per_month' => 'integer',
        'max_ai_requests_per_month' => 'integer',
        'can_export_pdf' => 'boolean',
        'can_export_docx' => 'boolean',
    ];

    /**
     * Get formatted price for a specific currency and period
     */
    public function getFormattedPrice(string $currency, string $period): string
    {
        $field = "{$period}_price_" . strtolower($currency);
        $amount = $this->$field ?? 0;
        
        return match($currency) {
            'USD' => '$' . number_format($amount / 100, 2),
            'INR' => '₹' . number_format($amount / 100, 0),
            'EUR' => '€' . number_format($amount / 100, 2),
            default => '$' . number_format($amount / 100, 2),
        };
    }

    /**
     * Get formatted monthly price (legacy - defaults to INR)
     */
    public function getFormattedMonthlyPriceAttribute(): string
    {
        return $this->getFormattedPrice('INR', 'monthly');
    }

    /**
     * Get formatted yearly price (legacy - defaults to INR)
     */
    public function getFormattedYearlyPriceAttribute(): string
    {
        return $this->getFormattedPrice('INR', 'yearly');
    }

    /**
     * Check if plan has unlimited resumes
     */
    public function hasUnlimitedResumes(): bool
    {
        return $this->max_resumes === null;
    }

    /**
     * Check if plan has unlimited templates
     */
    public function hasUnlimitedTemplates(): bool
    {
        return $this->max_templates === null;
    }

    /**
     * Get formatted limit for a field
     */
    public function getFormattedLimit(string $field): string
    {
        $value = $this->$field;
        return $value === null ? 'Unlimited' : (string) $value;
    }
}
