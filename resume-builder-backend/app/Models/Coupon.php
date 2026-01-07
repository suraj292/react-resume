<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'description',
        'max_uses',
        'max_uses_per_user',
        'current_uses',
        'min_purchase_amount',
        'valid_from',
        'valid_until',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_purchase_amount' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean',
        'max_uses' => 'integer',
        'max_uses_per_user' => 'integer',
        'current_uses' => 'integer',
    ];

    /**
     * Get all usage records for this coupon
     */
    public function usages()
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * Check if coupon is valid
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // Check if coupon has started
        if ($this->valid_from && Carbon::now()->isBefore($this->valid_from)) {
            return false;
        }

        // Check if coupon has expired
        if ($this->valid_until && Carbon::now()->isAfter($this->valid_until)) {
            return false;
        }

        // Check if max uses reached
        if ($this->max_uses && $this->current_uses >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Check if user can use this coupon
     */
    public function canBeUsedByUser($userId): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        $userUsageCount = $this->usages()->where('user_id', $userId)->count();
        
        return $userUsageCount < $this->max_uses_per_user;
    }

    /**
     * Calculate discount amount
     */
    public function calculateDiscount($amount): float
    {
        if ($this->type === 'percentage') {
            return round(($amount * $this->value) / 100, 2);
        }
        
        // Fixed amount
        return min($this->value, $amount);
    }

    /**
     * Get formatted discount value
     */
    public function getFormattedValueAttribute(): string
    {
        if ($this->type === 'percentage') {
            return $this->value . '%';
        }
        
        return '₹' . number_format($this->value, 2);
    }
}
