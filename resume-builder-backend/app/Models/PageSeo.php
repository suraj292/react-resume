<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSeo extends Model
{
    protected $table = 'page_seo';

    protected $fillable = [
        'page_route',
        'page_name',
        'is_published',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_title',
        'og_description',
        'og_image',
        'og_type',
        'og_url',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'twitter_site',
        'twitter_creator',
        'canonical_url',
        'robots',
        'language',
        'alternate_languages',
        'schema_markup',
        'priority',
        'notes',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'alternate_languages' => 'array',
        'schema_markup' => 'array',
        'priority' => 'integer',
    ];

    /**
     * Get all available static pages from routes
     */
    public static function getAvailablePages(): array
    {
        return [
            '/' => 'Home',
            '/pricing' => 'Pricing',
            '/ats-checker' => 'ATS Checker',
            '/contact' => 'Contact',
            '/about' => 'About',
            '/faq' => 'FAQ',
            '/privacy' => 'Privacy Policy',
            '/terms' => 'Terms of Service',
            '/builder' => 'Resume Builder',
            '/profile' => 'Profile',
            '/my-resumes' => 'My Resumes',
            '/checkout' => 'Checkout',
        ];
    }

    /**
     * Get SEO data for a specific route
     */
    public static function getForRoute(string $route): ?self
    {
        return self::where('page_route', $route)
            ->where('is_published', true)
            ->first();
    }
}
