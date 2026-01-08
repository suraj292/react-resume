<?php

namespace App\Filament\Resources\ResumeTemplateResource\Pages;

use App\Filament\Resources\ResumeTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListResumeTemplates extends ListRecords
{
    protected static string $resource = ResumeTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ResumeTemplateResource\Widgets\TemplateStatsOverview::class,
            ResumeTemplateResource\Widgets\TemplateAnalyticsWidget::class,
        ];
    }
}
