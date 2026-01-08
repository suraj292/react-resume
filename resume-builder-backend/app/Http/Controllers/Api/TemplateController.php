<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    /**
     * Get all active templates
     */
    public function index(Request $request)
    {
        $query = \App\Models\ResumeTemplate::active()->ordered();

        // Filter by premium status if requested
        if ($request->has('premium')) {
            $premium = filter_var($request->premium, FILTER_VALIDATE_BOOLEAN);
            $query = $premium ? $query->premium() : $query->free();
        }

        // Filter by complexity level
        if ($request->has('complexity')) {
            $query->where('complexity_level', $request->complexity);
        }

        $templates = $query->get()->map(function ($template) {
            return [
                'id' => $template->template_id,
                'name' => $template->name,
                'category' => $template->category,
                'description' => $template->description,
                'preview_image' => $template->preview_image_url,
                'thumbnail_image' => $template->thumbnail_image_url,
                'supported_colors' => $template->supported_colors,
                'features' => $template->features,
                'is_premium' => $template->is_premium,
                'best_for' => $template->best_for,
                'complexity_level' => $template->complexity_level,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $templates,
        ]);
    }

    /**
     * Get a specific template by ID
     */
    public function show($templateId)
    {
        $template = \App\Models\ResumeTemplate::where('template_id', $templateId)
            ->active()
            ->first();

        if (!$template) {
            return response()->json([
                'success' => false,
                'message' => 'Template not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $template->template_id,
                'name' => $template->name,
                'category' => $template->category,
                'description' => $template->description,
                'preview_image' => $template->preview_image_url,
                'thumbnail_image' => $template->thumbnail_image_url,
                'supported_colors' => $template->supported_colors,
                'features' => $template->features,
                'is_premium' => $template->is_premium,
                'best_for' => $template->best_for,
                'complexity_level' => $template->complexity_level,
            ],
        ]);
    }

    /**
     * Get template categories
     */
    public function categories()
    {
        $categories = \App\Models\ResumeTemplate::active()
            ->select('category')
            ->distinct()
            ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Track template selection
     */
    public function trackSelection(Request $request)
    {
        $templateId = $request->input('template_id');
        
        $template = \App\Models\ResumeTemplate::where('template_id', $templateId)->first();
        
        if (!$template) {
            return response()->json([
                'success' => false,
                'message' => 'Template not found',
            ], 404);
        }

        \Illuminate\Support\Facades\DB::table('template_analytics')->insert([
            'resume_template_id' => $template->id,
            'user_id' => auth()->id(),
            'action' => 'select',
            'session_id' => session()->getId(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Selection tracked',
        ]);
    }

    /**
     * Track template preview
     */
    public function trackPreview(Request $request)
    {
        $templateId = $request->input('template_id');
        
        $template = \App\Models\ResumeTemplate::where('template_id', $templateId)->first();
        
        if (!$template) {
            return response()->json([
                'success' => false,
                'message' => 'Template not found',
            ], 404);
        }

        \Illuminate\Support\Facades\DB::table('template_analytics')->insert([
            'resume_template_id' => $template->id,
            'user_id' => auth()->id(),
            'action' => 'preview',
            'session_id' => session()->getId(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Preview tracked',
        ]);
    }

    /**
     * Get template analytics (admin only)
     */
    public function analytics($templateId = null)
    {
        $query = \Illuminate\Support\Facades\DB::table('template_analytics')
            ->join('resume_templates', 'template_analytics.resume_template_id', '=', 'resume_templates.id');

        if ($templateId) {
            $template = \App\Models\ResumeTemplate::where('template_id', $templateId)->first();
            if (!$template) {
                return response()->json([
                    'success' => false,
                    'message' => 'Template not found',
                ], 404);
            }
            $query->where('resume_templates.id', $template->id);
        }

        $stats = [
            'total_selections' => (clone $query)->where('action', 'select')->count(),
            'total_previews' => (clone $query)->where('action', 'preview')->count(),
            'unique_users' => (clone $query)->whereNotNull('user_id')->distinct('user_id')->count('user_id'),
            'by_template' => \Illuminate\Support\Facades\DB::table('template_analytics')
                ->join('resume_templates', 'template_analytics.resume_template_id', '=', 'resume_templates.id')
                ->select(
                    'resume_templates.template_id',
                    'resume_templates.name',
                    \Illuminate\Support\Facades\DB::raw('COUNT(CASE WHEN action = "select" THEN 1 END) as selections'),
                    \Illuminate\Support\Facades\DB::raw('COUNT(CASE WHEN action = "preview" THEN 1 END) as previews')
                )
                ->groupBy('resume_templates.id', 'resume_templates.template_id', 'resume_templates.name')
                ->orderByDesc('selections')
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
