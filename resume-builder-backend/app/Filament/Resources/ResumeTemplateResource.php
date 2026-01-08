<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ResumeTemplateResource\Pages;
use App\Filament\Resources\ResumeTemplateResource\RelationManagers;
use App\Filament\Resources\ResumeTemplateResource\Widgets;
use App\Models\ResumeTemplate;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ResumeTemplateResource extends Resource
{
    protected static ?string $model = ResumeTemplate::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    
    protected static ?string $navigationGroup = 'Resume Builder';
    
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Template Information')
                            ->schema([
                                Forms\Components\TextInput::make('template_id')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255)
                                    ->helperText('Unique identifier (e.g., modern, creative)')
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => 
                                        $set('template_id', \Illuminate\Support\Str::slug($state))
                                    ),
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->maxLength(255)
                                    ->helperText('Display name for the template'),
                                Forms\Components\TextInput::make('category')
                                    ->required()
                                    ->maxLength(255)
                                    ->helperText('e.g., Best for Tech & SaaS, Design & Marketing'),
                                Forms\Components\Textarea::make('description')
                                    ->maxLength(65535)
                                    ->columnSpanFull()
                                    ->rows(3)
                                    ->helperText('Detailed description of the template'),
                                Forms\Components\TextInput::make('best_for')
                                    ->maxLength(255)
                                    ->helperText('Industry or role recommendation'),
                            ])
                            ->columns(2),

                        Forms\Components\Section::make('Template Features')
                            ->schema([
                                Forms\Components\TagsInput::make('features')
                                    ->helperText('Key features of this template (press Enter to add)')
                                    ->placeholder('Add feature')
                                    ->columnSpanFull(),
                                Forms\Components\TagsInput::make('supported_colors')
                                    ->helperText('Supported color schemes (e.g., indigo, emerald, rose)')
                                    ->placeholder('Add color')
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Images')
                            ->schema([
                                Forms\Components\FileUpload::make('preview_image')
                                    ->image()
                                    ->directory('template-previews')
                                    ->imageEditor()
                                    ->imageEditorAspectRatios([
                                        '3:4',
                                    ])
                                    ->helperText('Full preview image (recommended: 900x1200px)'),
                                Forms\Components\FileUpload::make('thumbnail_image')
                                    ->image()
                                    ->directory('template-thumbnails')
                                    ->imageEditor()
                                    ->imageEditorAspectRatios([
                                        '3:4',
                                    ])
                                    ->helperText('Thumbnail image (recommended: 300x400px)'),
                            ]),

                        Forms\Components\Section::make('Settings')
                            ->schema([
                                Forms\Components\Select::make('complexity_level')
                                    ->options([
                                        'beginner' => 'Beginner',
                                        'intermediate' => 'Intermediate',
                                        'advanced' => 'Advanced',
                                    ])
                                    ->default('intermediate')
                                    ->required(),
                                Forms\Components\TextInput::make('sort_order')
                                    ->numeric()
                                    ->default(0)
                                    ->required()
                                    ->helperText('Lower numbers appear first'),
                                Forms\Components\Toggle::make('is_active')
                                    ->default(true)
                                    ->helperText('Show this template to users'),
                                Forms\Components\Toggle::make('is_premium')
                                    ->default(false)
                                    ->helperText('Require premium subscription'),
                            ]),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('thumbnail_image')
                    ->label('Thumbnail')
                    ->circular()
                    ->defaultImageUrl(url('/images/placeholder-template.png')),
                Tables\Columns\TextColumn::make('template_id')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->badge()
                    ->color('primary'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->description(fn (ResumeTemplate $record): string => $record->category ?? ''),
                Tables\Columns\TextColumn::make('complexity_level')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'beginner' => 'success',
                        'intermediate' => 'warning',
                        'advanced' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable()
                    ->label('Order'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_premium')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order', 'asc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active')
                    ->placeholder('All templates')
                    ->trueLabel('Active only')
                    ->falseLabel('Inactive only'),
                Tables\Filters\TernaryFilter::make('is_premium')
                    ->label('Premium')
                    ->placeholder('All templates')
                    ->trueLabel('Premium only')
                    ->falseLabel('Free only'),
                Tables\Filters\SelectFilter::make('complexity_level')
                    ->options([
                        'beginner' => 'Beginner',
                        'intermediate' => 'Intermediate',
                        'advanced' => 'Advanced',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('activate')
                        ->label('Activate')
                        ->icon('heroicon-o-check-circle')
                        ->action(fn ($records) => $records->each->update(['is_active' => true]))
                        ->deselectRecordsAfterCompletion()
                        ->color('success'),
                    Tables\Actions\BulkAction::make('deactivate')
                        ->label('Deactivate')
                        ->icon('heroicon-o-x-circle')
                        ->action(fn ($records) => $records->each->update(['is_active' => false]))
                        ->deselectRecordsAfterCompletion()
                        ->color('danger'),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListResumeTemplates::route('/'),
            'create' => Pages\CreateResumeTemplate::route('/create'),
            'edit' => Pages\EditResumeTemplate::route('/{record}/edit'),
        ];
    }

    public static function getWidgets(): array
    {
        return [
            Widgets\TemplateStatsOverview::class,
            Widgets\TemplateAnalyticsWidget::class,
        ];
    }
}
