<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PricingPlanResource\Pages;
use App\Models\PricingPlan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\Enums\FontWeight;

class PricingPlanResource extends Resource
{
    protected static ?string $model = PricingPlan::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    
    protected static ?string $navigationGroup = 'Content Management';
    
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Plan Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', \Str::slug($state)))
                            ->columnSpan(1),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->columnSpan(1),
                        Forms\Components\Textarea::make('description')
                            ->required()
                            ->maxLength(500)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Multi-Currency Pricing')
                    ->description('Set prices for all supported currencies in whole units (will be converted to smallest units for storage)')
                    ->schema([
                        // USD Pricing
                        Forms\Components\Fieldset::make('USD (United States Dollar)')
                            ->schema([
                                Forms\Components\TextInput::make('monthly_price_usd')
                                    ->label('Monthly ($)')
                                    ->numeric()
                                    ->default(0)
                                    ->prefix('$')
                                    ->helperText('e.g., 4.99 for $4.99')
                                    ->step(0.01)
                                    ->dehydrateStateUsing(fn ($state) => $state ? (int)($state * 100) : 0)
                                    ->formatStateUsing(fn ($state) => $state ? $state / 100 : 0)
                                    ->columnSpan(1),
                                Forms\Components\TextInput::make('yearly_price_usd')
                                    ->label('Yearly ($)')
                                    ->numeric()
                                    ->default(0)
                                    ->prefix('$')
                                    ->helperText('e.g., 49.99 for $49.99')
                                    ->step(0.01)
                                    ->dehydrateStateUsing(fn ($state) => $state ? (int)($state * 100) : 0)
                                    ->formatStateUsing(fn ($state) => $state ? $state / 100 : 0)
                                    ->columnSpan(1),
                            ])
                            ->columns(2),
                            
                        // INR Pricing
                        Forms\Components\Fieldset::make('INR (Indian Rupee)')
                            ->schema([
                                Forms\Components\TextInput::make('monthly_price_inr')
                                    ->label('Monthly (₹)')
                                    ->numeric()
                                    ->default(0)
                                    ->prefix('₹')
                                    ->helperText('e.g., 499 for ₹499')
                                    ->step(1)
                                    ->dehydrateStateUsing(fn ($state) => $state ? (int)($state * 100) : 0)
                                    ->formatStateUsing(fn ($state) => $state ? $state / 100 : 0)
                                    ->columnSpan(1),
                                Forms\Components\TextInput::make('yearly_price_inr')
                                    ->label('Yearly (₹)')
                                    ->numeric()
                                    ->default(0)
                                    ->prefix('₹')
                                    ->helperText('e.g., 4999 for ₹4,999')
                                    ->step(1)
                                    ->dehydrateStateUsing(fn ($state) => $state ? (int)($state * 100) : 0)
                                    ->formatStateUsing(fn ($state) => $state ? $state / 100 : 0)
                                    ->columnSpan(1),
                            ])
                            ->columns(2),
                            
                        // EUR Pricing
                        Forms\Components\Fieldset::make('EUR (Euro)')
                            ->schema([
                                Forms\Components\TextInput::make('monthly_price_eur')
                                    ->label('Monthly (€)')
                                    ->numeric()
                                    ->default(0)
                                    ->prefix('€')
                                    ->helperText('e.g., 4.99 for €4.99')
                                    ->step(0.01)
                                    ->dehydrateStateUsing(fn ($state) => $state ? (int)($state * 100) : 0)
                                    ->formatStateUsing(fn ($state) => $state ? $state / 100 : 0)
                                    ->columnSpan(1),
                                Forms\Components\TextInput::make('yearly_price_eur')
                                    ->label('Yearly (€)')
                                    ->numeric()
                                    ->default(0)
                                    ->prefix('€')
                                    ->helperText('e.g., 49.99 for €49.99')
                                    ->step(0.01)
                                    ->dehydrateStateUsing(fn ($state) => $state ? (int)($state * 100) : 0)
                                    ->formatStateUsing(fn ($state) => $state ? $state / 100 : 0)
                                    ->columnSpan(1),
                            ])
                            ->columns(2),
                    ])
                    ->columns(1)
                    ->collapsible(),

                Forms\Components\Section::make('Features')
                    ->schema([
                        Forms\Components\Repeater::make('features')
                            ->schema([
                                Forms\Components\TextInput::make('text')
                                    ->label('Feature Text')
                                    ->required()
                                    ->columnSpan(2),
                                Forms\Components\Toggle::make('included')
                                    ->label('Included')
                                    ->default(true)
                                    ->columnSpan(1),
                            ])
                            ->columns(3)
                            ->defaultItems(3)
                            ->columnSpanFull()
                            ->addActionLabel('Add Feature'),
                    ]),

                Forms\Components\Section::make('Feature Limits')
                    ->description('Set usage limits for this plan. Leave empty for unlimited.')
                    ->schema([
                        Forms\Components\TextInput::make('max_resumes')
                            ->label('Max Resumes')
                            ->numeric()
                            ->nullable()
                            ->helperText('Leave empty for unlimited')
                            ->columnSpan(1),
                        Forms\Components\TextInput::make('max_templates')
                            ->label('Max Templates')
                            ->numeric()
                            ->nullable()
                            ->helperText('Leave empty for unlimited')
                            ->columnSpan(1),
                        Forms\Components\TextInput::make('max_downloads_per_month')
                            ->label('Max Downloads/Month')
                            ->numeric()
                            ->nullable()
                            ->helperText('Leave empty for unlimited')
                            ->columnSpan(1),
                        Forms\Components\TextInput::make('max_ai_requests_per_month')
                            ->label('Max AI Requests/Month')
                            ->numeric()
                            ->nullable()
                            ->helperText('Leave empty for unlimited')
                            ->columnSpan(1),
                        Forms\Components\Toggle::make('can_export_pdf')
                            ->label('Can Export PDF')
                            ->default(false)
                            ->columnSpan(1),
                        Forms\Components\Toggle::make('can_export_docx')
                            ->label('Can Export DOCX')
                            ->default(false)
                            ->columnSpan(1),
                    ])
                    ->columns(2)
                    ->collapsible(),

                Forms\Components\Section::make('Display Settings')
                    ->schema([
                        Forms\Components\TextInput::make('button_text')
                            ->default('Get Started')
                            ->required()
                            ->columnSpan(1),
                        Forms\Components\TextInput::make('button_link')
                            ->default('#')
                            ->required()
                            ->columnSpan(1),
                        Forms\Components\TextInput::make('badge_text')
                            ->label('Badge Text (Optional)')
                            ->placeholder('e.g., MOST POPULAR')
                            ->columnSpan(1),
                        Forms\Components\Select::make('theme')
                            ->options([
                                'light' => 'Light',
                                'dark' => 'Dark',
                            ])
                            ->default('light')
                            ->required()
                            ->columnSpan(1),
                        Forms\Components\TextInput::make('sort_order')
                            ->numeric()
                            ->default(0)
                            ->required()
                            ->helperText('Lower numbers appear first')
                            ->columnSpan(1),
                        Forms\Components\Toggle::make('is_popular')
                            ->label('Mark as Popular')
                            ->default(false)
                            ->columnSpan(1),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->columnSpan(1),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold),
                Tables\Columns\TextColumn::make('description')
                    ->limit(50)
                    ->searchable(),
                Tables\Columns\TextColumn::make('formatted_monthly_price')
                    ->label('Monthly')
                    ->sortable(query: function ($query, $direction) {
                        return $query->orderBy('monthly_price', $direction);
                    }),
                Tables\Columns\TextColumn::make('formatted_yearly_price')
                    ->label('Yearly')
                    ->sortable(query: function ($query, $direction) {
                        return $query->orderBy('yearly_price', $direction);
                    }),
                Tables\Columns\BadgeColumn::make('theme')
                    ->colors([
                        'secondary' => 'light',
                        'primary' => 'dark',
                    ]),
                Tables\Columns\IconColumn::make('is_popular')
                    ->label('Popular')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning')
                    ->falseColor('gray'),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),
            ])
            ->defaultSort('sort_order', 'asc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Plans'),
                Tables\Filters\TernaryFilter::make('is_popular')
                    ->label('Popular Plans'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListPricingPlans::route('/'),
            'create' => Pages\CreatePricingPlan::route('/create'),
            'view' => Pages\ViewPricingPlan::route('/{record}'),
            'edit' => Pages\EditPricingPlan::route('/{record}/edit'),
        ];
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_active', true)->count();
    }
}
