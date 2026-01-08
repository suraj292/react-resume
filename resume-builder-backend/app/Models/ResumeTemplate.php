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
