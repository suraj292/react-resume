<?php

namespace App\Filament\Resources\ResumeTemplateResource\Widgets;

use App\Models\ResumeTemplate;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class TemplateStatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        // Get total analytics
        $totalSelections = DB::table('template_analytics')
            ->where('action', 'select')
            ->count();

        $totalPreviews = DB::table('template_analytics')
            ->where('action', 'preview')
            ->count();

        $uniqueUsers = DB::table('template_analytics')
            ->whereNotNull('user_id')
            ->distinct('user_id')
            ->count('user_id');

        // Get most popular template
        $mostPopular = DB::table('template_analytics')
            ->join('resume_templates', 'template_analytics.resume_template_id', '=', 'resume_templates.id')
            ->select('resume_templates.name', DB::raw('COUNT(*) as total'))
            ->where('action', 'select')
            ->groupBy('resume_templates.id', 'resume_templates.name')
            ->orderByDesc('total')
            ->first();

        // Get selections in last 7 days
        $recentSelections = DB::table('template_analytics')
            ->where('action', 'select')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        // Get total active templates
        $activeTemplates = ResumeTemplate::active()->count();

        return [
            Stat::make('Total Template Selections', $totalSelections)
                ->description('All-time template selections')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->chart([$totalSelections]),

            Stat::make('Total Previews', $totalPreviews)
                ->description('Template preview views')
                ->descriptionIcon('heroicon-m-eye')
                ->color('info')
                ->chart([$totalPreviews]),

            Stat::make('Unique Users', $uniqueUsers)
                ->description('Users who selected templates')
                ->descriptionIcon('heroicon-m-users')
                ->color('warning'),

            Stat::make('Most Popular', $mostPopular?->name ?? 'N/A')
                ->description(($mostPopular?->total ?? 0) . ' selections')
                ->descriptionIcon('heroicon-m-star')
                ->color('primary'),

            Stat::make('Recent Activity (7 days)', $recentSelections)
                ->description('Selections in last week')
                ->descriptionIcon('heroicon-m-calendar')
                ->color('success'),

            Stat::make('Active Templates', $activeTemplates)
                ->description('Currently available')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('gray'),
        ];
    }
}
