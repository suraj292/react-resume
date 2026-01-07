<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'status',
        'admin_notes',
        'read_at',
        'replied_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'replied_at' => 'datetime',
    ];

    /**
     * Mark enquiry as read
     */
    public function markAsRead()
    {
        if (!$this->read_at) {
            $this->update([
                'read_at' => now(),
                'status' => 'read',
            ]);
        }
    }

    /**
     * Mark enquiry as replied
     */
    public function markAsReplied()
    {
        $this->update([
            'replied_at' => now(),
            'status' => 'replied',
        ]);
    }

    /**
     * Scope for new enquiries
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope for unread enquiries
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'new' => 'success',
            'read' => 'info',
            'replied' => 'warning',
            'closed' => 'danger',
            default => 'secondary',
        };
    }
}
