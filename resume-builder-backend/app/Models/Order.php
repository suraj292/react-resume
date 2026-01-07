<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'plan_slug',
        'plan_name',
        'period',
        'base_price',
        'gst_amount',
        'coupon_id',
        'coupon_code',
        'discount_amount',
        'total_amount',
        'currency',
        'payment_id',
        'payment_signature',
        'payment_status',
        'payment_method',
        'valid_from',
        'valid_until',
        'phone_number',
        'billing_address',
        'notes',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'gst_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
    ];

    /**
     * Get the user that owns the order
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the coupon used in this order
     */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Get formatted total amount with currency
     */
    public function getFormattedTotalAttribute(): string
    {
        $symbol = match($this->currency) {
            'INR' => '₹',
            'USD' => '$',
            'EUR' => '€',
            default => $this->currency . ' ',
        };
        
        return $symbol . number_format($this->total_amount, 2);
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->payment_status) {
            'completed' => 'success',
            'pending' => 'warning',
            'failed' => 'danger',
            'refunded' => 'info',
            default => 'secondary',
        };
    }

    /**
     * Check if order is active/valid
     */
    public function isActive(): bool
    {
        if ($this->payment_status !== 'completed') {
            return false;
        }

        if (!$this->valid_until) {
            return true; // Lifetime access
        }

        return now()->lessThan($this->valid_until);
    }
}
