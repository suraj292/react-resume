<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageSeo;
use Illuminate\Http\Request;

class PageSeoController extends Controller
{
    /**
     * Get SEO data for a specific route
     */
    public function show(Request $request, string $route)
    {
        // Normalize route
        $route = '/' . ltrim($route, '/');
        if ($route === '//') {
            $route = '/';
        }

        $seo = PageSeo::getForRoute($route);

        if (!$seo) {
            return response()->json([
                'success' => false,
                'message' => 'SEO data not found for this route',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'meta_title' => $seo->meta_title,
                'meta_description' => $seo->meta_description,
                'meta_keywords' => $seo->meta_keywords,
                'og_title' => $seo->og_title,
                'og_description' => $seo->og_description,
                'og_image' => $seo->og_image,
                'og_type' => $seo->og_type,
                'og_url' => $seo->og_url,
                'twitter_card' => $seo->twitter_card,
                'twitter_title' => $seo->twitter_title,
                'twitter_description' => $seo->twitter_description,
                'twitter_image' => $seo->twitter_image,
                'twitter_site' => $seo->twitter_site,
                'twitter_creator' => $seo->twitter_creator,
                'canonical_url' => $seo->canonical_url,
                'robots' => $seo->robots,
                'language' => $seo->language,
                'alternate_languages' => $seo->alternate_languages,
                'schema_markup' => $seo->schema_markup,
            ],
        ]);
    }

    /**
     * Get all published SEO pages
     */
    public function index()
    {
        $pages = PageSeo::where('is_published', true)
            ->orderBy('priority', 'desc')
            ->get()
            ->map(function ($page) {
                return [
                    'page_route' => $page->page_route,
                    'page_name' => $page->page_name,
                    'meta_title' => $page->meta_title,
                    'meta_description' => $page->meta_description,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $pages,
        ]);
    }
}
