<?php

namespace App\Models;

use App\Services\PlanAccessService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'provider',
        'provider_id',
        'avatar',
        'job_title',
        'phone',
        'location',
        'currency_preference',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /** The canonical active subscription (single row, from subscriptions table). */
    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('valid_until')
                    ->orWhere('valid_until', '>', now());
            })
            ->latest();
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function resumes()
    {
        return $this->hasMany(Resume::class);
    }

    public function downloads()
    {
        return $this->hasMany(Download::class);
    }

    public function aiRequests()
    {
        return $this->hasMany(AiRequest::class);
    }

    // ── Plan helpers (delegated to PlanAccessService) ─────────────────────────

    public function getCurrentPlan()
    {
        return app(PlanAccessService::class)->getUserPlan($this);
    }

    public function canCreateResume(): bool
    {
        return app(PlanAccessService::class)->canCreateResume($this);
    }

    public function canDownload(string $format = 'pdf'): bool
    {
        return app(PlanAccessService::class)->canDownload($this, $format);
    }

    public function canUseAI(): bool
    {
        return app(PlanAccessService::class)->canUseAI($this);
    }

    public function getPlanLimits(): array
    {
        return app(PlanAccessService::class)->getPlanLimits($this);
    }
}
