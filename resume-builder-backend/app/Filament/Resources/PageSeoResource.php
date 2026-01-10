<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageSeoResource\Pages;
use App\Models\PageSeo;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PageSeoResource extends Resource
{
    protected static ?string $model = PageSeo::class;

    protected static ?string $navigationIcon = 'heroicon-o-magnifying-glass';
    
    protected static ?string $navigationLabel = 'Pages SEO';
    
    protected static ?string $navigationGroup = 'Content Management';
    
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Page Selection')
                    ->description('Select the page you want to manage SEO tags for')
                    ->schema([
                        Forms\Components\Select::make('page_route')
                            ->label('Page Route')
                            ->options(PageSeo::getAvailablePages())
                            ->required()
                            ->searchable()
                            ->helperText('Select the page to manage SEO settings')
                            ->unique(ignoreRecord: true),
                        
                        Forms\Components\TextInput::make('page_name')
                            ->label('Page Name')
                            ->required()
                            ->maxLength(255)
                            ->helperText('Internal name for this page'),
                        
                        Forms\Components\Toggle::make('is_published')
                            ->label('Published')
                            ->default(true)
                            ->helperText('Toggle to publish or unpublish SEO tags for this page'),
                    ])
                    ->columns(1)
                    ->collapsible(),

                Forms\Components\Tabs::make('SEO Settings')
                    ->tabs([
                        // Basic Meta Tab
                        Forms\Components\Tabs\Tab::make('Basic Meta')
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Forms\Components\TextInput::make('meta_title')
                                    ->label('Meta Title')
                                    ->maxLength(60)
                                    ->helperText('Recommended: 50-60 characters')
                                    ->reactive()
                                    ->afterStateUpdated(fn ($state, callable $set) => 
                                        $set('character_count_title', strlen($state ?? ''))
                                    ),
                                
                                Forms\Components\Placeholder::make('character_count_title')
                                    ->label('Character Count')
                                    ->content(fn ($get) => strlen($get('meta_title') ?? '') . ' / 60 characters'),
                                
                                Forms\Components\Textarea::make('meta_description')
                                    ->label('Meta Description')
                                    ->rows(3)
                                    ->maxLength(160)
                                    ->helperText('Recommended: 150-160 characters')
                                    ->reactive()
                                    ->afterStateUpdated(fn ($state, callable $set) => 
                                        $set('character_count_desc', strlen($state ?? ''))
                                    ),
                                
                                Forms\Components\Placeholder::make('character_count_desc')
                                    ->label('Character Count')
                                    ->content(fn ($get) => strlen($get('meta_description') ?? '') . ' / 160 characters'),
                                
                                Forms\Components\Textarea::make('meta_keywords')
                                    ->label('Meta Keywords')
                                    ->rows(2)
                                    ->helperText('Comma-separated keywords (optional)'),
                            ]),

                        // Open Graph Tab
                        Forms\Components\Tabs\Tab::make('Open Graph')
                            ->icon('heroicon-o-share')
                            ->schema([
                                Forms\Components\TextInput::make('og_title')
                                    ->label('OG Title')
                                    ->maxLength(255)
                                    ->helperText('Title for social media sharing'),
                                
                                Forms\Components\Textarea::make('og_description')
                                    ->label('OG Description')
                                    ->rows(3)
                                    ->helperText('Description for social media sharing'),
                                
                                Forms\Components\FileUpload::make('og_image')
                                    ->label('OG Image')
                                    ->image()
                                    ->directory('seo/og-images')
                                    ->helperText('Recommended: 1200x630px'),
                                
                                Forms\Components\Select::make('og_type')
                                    ->label('OG Type')
                                    ->options([
                                        'website' => 'Website',
                                        'article' => 'Article',
                                        'product' => 'Product',
                                    ])
                                    ->default('website'),
                                
                                Forms\Components\TextInput::make('og_url')
                                    ->label('OG URL')
                                    ->url()
                                    ->helperText('Full URL of the page'),
                                
                                Forms\Components\TextInput::make('og_site_name')
                                    ->label('OG Site Name')
                                    ->maxLength(255)
                                    ->helperText('Name of your website (e.g., ResumeBP)'),
                            ]),

                        // Twitter Card Tab
                        Forms\Components\Tabs\Tab::make('Twitter Card')
                            ->icon('heroicon-o-at-symbol')
                            ->schema([
                                Forms\Components\Select::make('twitter_card')
                                    ->label('Twitter Card Type')
                                    ->options([
                                        'summary' => 'Summary',
                                        'summary_large_image' => 'Summary Large Image',
                                        'app' => 'App',
                                        'player' => 'Player',
                                    ])
                                    ->default('summary_large_image'),
                                
                                Forms\Components\TextInput::make('twitter_title')
                                    ->label('Twitter Title')
                                    ->maxLength(255),
                                
                                Forms\Components\Textarea::make('twitter_description')
                                    ->label('Twitter Description')
                                    ->rows(3),
                                
                                Forms\Components\FileUpload::make('twitter_image')
                                    ->label('Twitter Image')
                                    ->image()
                                    ->directory('seo/twitter-images')
                                    ->helperText('Recommended: 1200x675px'),
                                
                                Forms\Components\TextInput::make('twitter_site')
                                    ->label('Twitter Site Handle')
                                    ->placeholder('@yourbrand')
                                    ->helperText('Your brand\'s Twitter handle'),
                                
                                Forms\Components\TextInput::make('twitter_creator')
                                    ->label('Twitter Creator Handle')
                                    ->placeholder('@author')
                                    ->helperText('Content creator\'s Twitter handle'),
                            ]),

                        // Technical SEO Tab
                        Forms\Components\Tabs\Tab::make('Technical SEO')
                            ->icon('heroicon-o-cog-6-tooth')
                            ->schema([
                                Forms\Components\TextInput::make('canonical_url')
                                    ->label('Canonical URL')
                                    ->url()
                                    ->helperText('Preferred URL for this page'),
                                
                                Forms\Components\Select::make('robots')
                                    ->label('Robots Meta Tag')
                                    ->options([
                                        'index, follow' => 'Index, Follow',
                                        'noindex, follow' => 'No Index, Follow',
                                        'index, nofollow' => 'Index, No Follow',
                                        'noindex, nofollow' => 'No Index, No Follow',
                                    ])
                                    ->default('index, follow')
                                    ->helperText('Control search engine indexing'),
                                
                                Forms\Components\Select::make('language')
                                    ->label('Language')
                                    ->options([
                                        'en' => 'English',
                                        'es' => 'Spanish',
                                        'fr' => 'French',
                                        'de' => 'German',
                                        'it' => 'Italian',
                                        'pt' => 'Portuguese',
                                        'zh' => 'Chinese',
                                        'ja' => 'Japanese',
                                        'ko' => 'Korean',
                                    ])
                                    ->default('en')
                                    ->searchable(),
                                
                                Forms\Components\KeyValue::make('alternate_languages')
                                    ->label('Alternate Languages')
                                    ->keyLabel('Language Code')
                                    ->valueLabel('URL')
                                    ->helperText('Alternate language versions of this page'),
                            ]),

                        // Schema Markup Tab
                        Forms\Components\Tabs\Tab::make('Schema Markup')
                            ->icon('heroicon-o-code-bracket')
                            ->schema([
                                Forms\Components\Textarea::make('schema_markup')
                                    ->label('JSON-LD Schema')
                                    ->rows(10)
                                    ->helperText('Add structured data in JSON-LD format')
                                    ->placeholder('{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Name",
  "description": "Page Description"
}'),
                            ]),
                    ])
                    ->columnSpanFull(),

                Forms\Components\Section::make('Additional Settings')
                    ->schema([
                        Forms\Components\TextInput::make('priority')
                            ->label('Display Priority')
                            ->numeric()
                            ->default(5)
                            ->minValue(1)
                            ->maxValue(10)
                            ->helperText('Higher priority pages appear first in the list'),
                        
                        Forms\Components\Textarea::make('notes')
                            ->label('Internal Notes')
                            ->rows(3)
                            ->helperText('Notes for internal use (not visible to users)'),
                    ])
                    ->columns(1)
                    ->collapsible()
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('page_name')
                    ->label('Page')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                
                Tables\Columns\TextColumn::make('page_route')
                    ->label('Route')
                    ->searchable()
                    ->badge()
                    ->color('gray'),
                
                Tables\Columns\IconColumn::make('is_published')
                    ->label('Published')
                    ->boolean()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('meta_title')
                    ->label('Meta Title')
                    ->limit(50)
                    ->searchable(),
                
                Tables\Columns\TextColumn::make('priority')
                    ->label('Priority')
                    ->sortable()
                    ->badge()
                    ->color(fn ($state) => match(true) {
                        $state >= 8 => 'success',
                        $state >= 5 => 'warning',
                        default => 'gray',
                    }),
                
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime()
                    ->sortable()
                    ->since(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_published')
                    ->label('Published')
                    ->placeholder('All pages')
                    ->trueLabel('Published only')
                    ->falseLabel('Unpublished only'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('priority', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPageSeos::route('/'),
            'create' => Pages\CreatePageSeo::route('/create'),
            'edit' => Pages\EditPageSeo::route('/{record}/edit'),
        ];
    }
}
