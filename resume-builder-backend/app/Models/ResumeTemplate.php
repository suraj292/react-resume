<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResumeTemplate extends Model
{
    protected $fillable = [
        'template_id',
        'name',
        'category',
        'description',
        'preview_image',
        'thumbnail_image',
        'supported_colors',
        'features',
        'is_active',
        'is_premium',
        'plan_tier',
        'sort_order',
        'best_for',
        'complexity_level',
    ];

    protected $casts = [
        'supported_colors' => 'array',
        'features' => 'array',
        'is_active' => 'boolean',
        'is_premium' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Scope to get only active templates
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only free templates
     */
    public function scopeFree($query)
    {
        return $query->where('is_premium', false);
    }

    /**
     * Scope to get only premium templates
     */
    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    /**
     * Scope to order by sort order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    /**
     * Scope to get templates for a specific plan tier
     */
    public function scopeForPlanTier($query, string $tier)
    {
        $tierHierarchy = ['free' => 1, 'starter' => 2, 'professional' => 3, 'unlimited' => 4];
        $userTierLevel = $tierHierarchy[$tier] ?? 1;
        
        return $query->where(function ($q) use ($tierHierarchy, $userTierLevel) {
            foreach ($tierHierarchy as $planTier => $level) {
                if ($level <= $userTierLevel) {
                    $q->orWhere('plan_tier', $planTier);
                }
            }
        });
    }

    /**
     * Check if template is accessible by a specific plan
     */
    public function isAccessibleByPlan(string $planSlug): bool
    {
        $tierHierarchy = [
            'free' => ['free'],
            'starter' => ['free', 'starter'],
            'professional' => ['free', 'starter', 'professional'],
            'unlimited' => ['free', 'starter', 'professional', 'unlimited'],
        ];
        
        $accessibleTiers = $tierHierarchy[$planSlug] ?? ['free'];
        return in_array($this->plan_tier, $accessibleTiers);
    }

    /**
     * Get the preview image URL
     */
    public function getPreviewImageUrlAttribute()
    {
        return $this->preview_image ? asset('storage/' . $this->preview_image) : null;
    }

    /**
     * Get the thumbnail image URL
     */
    public function getThumbnailImageUrlAttribute()
    {
        return $this->thumbnail_image ? asset('storage/' . $this->thumbnail_image) : null;
    }
}
