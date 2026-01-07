<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'label',
        'value',
        'type',
        'icon',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get active contact settings ordered by order field
     */
    public static function getActive()
    {
        return self::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    /**
     * Get contact setting by key
     */
    public static function getByKey(string $key)
    {
        return self::where('key', $key)->first();
    }
}
