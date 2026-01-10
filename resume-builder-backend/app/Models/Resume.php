<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resume extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'data',
        'template_id',
        'color_id',
        'etag',
        'last_saved_at',
        'ats_score',
        'ats_data',
    ];

    protected $casts = [
        'data' => 'array',
        'ats_data' => 'array',
        'last_saved_at' => 'datetime',
    ];

    /**
     * Get the user that owns the resume
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the downloads for this resume.
     */
    public function downloads()
    {
        return $this->hasMany(Download::class);
    }

    /**
     * Get the AI requests for this resume.
     */
    public function aiRequests()
    {
        return $this->hasMany(AiRequest::class);
    }
}
