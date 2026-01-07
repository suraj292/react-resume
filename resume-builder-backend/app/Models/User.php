<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'provider',
        'provider_id',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the orders for the user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the user's active subscription order.
     */
    public function activeSubscription()
    {
        return $this->hasOne(Order::class)
            ->where('payment_status', 'completed')
            ->where(function ($query) {
                $query->whereNull('valid_until')
                    ->orWhere('valid_until', '>', now());
            })
            ->latest();
    }

    /**
     * Get the user's resumes.
     */
    public function resumes()
    {
        return $this->hasMany(Resume::class);
    }

    /**
     * Get the user's downloads.
     */
    public function downloads()
    {
        return $this->hasMany(Download::class);
    }

    /**
     * Get the user's AI requests.
     */
    public function aiRequests()
    {
        return $this->hasMany(AiRequest::class);
    }

    /**
     * Get the user's current plan.
     */
    public function getCurrentPlan()
    {
        return app(\App\Services\PlanAccessService::class)->getUserPlan($this);
    }

    /**
     * Check if user can create more resumes.
     */
    public function canCreateResume(): bool
    {
        return app(\App\Services\PlanAccessService::class)->canCreateResume($this);
    }

    /**
     * Check if user can download in a specific format.
     */
    public function canDownload(string $format = 'pdf'): bool
    {
        return app(\App\Services\PlanAccessService::class)->canDownload($this, $format);
    }

    /**
     * Check if user can use AI features.
     */
    public function canUseAI(): bool
    {
        return app(\App\Services\PlanAccessService::class)->canUseAI($this);
    }

    /**
     * Get user's plan limits.
     */
    public function getPlanLimits(): array
    {
        return app(\App\Services\PlanAccessService::class)->getPlanLimits($this);
    }
}
