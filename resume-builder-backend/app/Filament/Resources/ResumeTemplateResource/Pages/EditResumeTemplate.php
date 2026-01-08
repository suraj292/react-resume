<?php

namespace App\Filament\Resources\ResumeTemplateResource\Pages;

use App\Filament\Resources\ResumeTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditResumeTemplate extends EditRecord
{
    protected static string $resource = ResumeTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
