<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Resume extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'data',
        'template_id',
        'color_id',
        'etag',
        'last_saved_at',
    ];

    protected $casts = [
        'data' => 'array',
        'last_saved_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        // Generate ETag on create and update
        static::creating(function ($resume) {
            $resume->etag = Str::uuid()->toString();
        });

        static::updating(function ($resume) {
            $resume->etag = Str::uuid()->toString();
            $resume->last_saved_at = now();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function uploads()
    {
        return $this->hasMany(ResumeUpload::class);
    }
}
