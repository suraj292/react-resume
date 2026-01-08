<?php

namespace App\Filament\Resources\ResumeTemplateResource\Widgets;

use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class TemplateAnalyticsWidget extends ChartWidget
{
    protected static ?string $heading = 'Template Usage Analytics';
    
    protected static ?int $sort = 2;
    
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        // Get top 10 templates by selections
        $stats = DB::table('template_analytics')
            ->join('resume_templates', 'template_analytics.resume_template_id', '=', 'resume_templates.id')
            ->select(
                'resume_templates.name',
                DB::raw('COUNT(CASE WHEN action = "select" THEN 1 END) as selections'),
                DB::raw('COUNT(CASE WHEN action = "preview" THEN 1 END) as previews')
            )
            ->groupBy('resume_templates.id', 'resume_templates.name')
            ->orderByDesc('selections')
            ->limit(10)
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Selections',
                    'data' => $stats->pluck('selections')->toArray(),
                    'backgroundColor' => '#4f46e5',
                    'borderColor' => '#4338ca',
                ],
                [
                    'label' => 'Previews',
                    'data' => $stats->pluck('previews')->toArray(),
                    'backgroundColor' => '#06b6d4',
                    'borderColor' => '#0891b2',
                ],
            ],
            'labels' => $stats->pluck('name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
    
    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                ],
            ],
        ];
    }
}
