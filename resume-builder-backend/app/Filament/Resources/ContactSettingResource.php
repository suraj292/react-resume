<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactSettingResource\Pages;
use App\Models\ContactSetting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactSettingResource extends Resource
{
    protected static ?string $model = ContactSetting::class;

    protected static ?string $navigationIcon = 'heroicon-o-phone';
    
    protected static ?string $navigationLabel = 'Contact Settings';
    
    protected static ?string $navigationGroup = 'Settings';
    
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Contact Information')
                    ->schema([
                        Forms\Components\TextInput::make('key')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->helperText('Unique identifier (e.g., email, phone, address)')
                            ->columnSpanFull(),
                            
                        Forms\Components\TextInput::make('label')
                            ->required()
                            ->maxLength(255)
                            ->helperText('Display label (e.g., Email Support, Phone Number)')
                            ->columnSpanFull(),
                            
                        Forms\Components\Select::make('type')
                            ->required()
                            ->options([
                                'text' => 'Text',
                                'email' => 'Email',
                                'phone' => 'Phone',
                                'textarea' => 'Textarea',
                                'url' => 'URL',
                            ])
                            ->default('text')
                            ->reactive()
                            ->columnSpan(1),
                            
                        Forms\Components\TextInput::make('icon')
                            ->maxLength(255)
                            ->helperText('FontAwesome icon class (e.g., fa-envelope, fa-phone)')
                            ->columnSpan(1),
                            
                        Forms\Components\Textarea::make('value')
                            ->rows(3)
                            ->columnSpanFull()
                            ->helperText('The actual contact information'),
                            
                        Forms\Components\TextInput::make('order')
                            ->numeric()
                            ->default(0)
                            ->helperText('Display order (lower numbers appear first)')
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
                Tables\Columns\TextColumn::make('label')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                    
                Tables\Columns\TextColumn::make('key')
                    ->searchable()
                    ->badge()
                    ->color('gray'),
                    
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'email' => 'success',
                        'phone' => 'info',
                        'url' => 'warning',
                        default => 'gray',
                    }),
                    
                Tables\Columns\TextColumn::make('value')
                    ->limit(50)
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('order')
                    ->sortable()
                    ->alignCenter(),
                    
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active')
                    ->alignCenter(),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'text' => 'Text',
                        'email' => 'Email',
                        'phone' => 'Phone',
                        'textarea' => 'Textarea',
                        'url' => 'URL',
                    ]),
                    
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->trueLabel('Active only')
                    ->falseLabel('Inactive only')
                    ->native(false),
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
            ->defaultSort('order', 'asc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactSettings::route('/'),
            'create' => Pages\CreateContactSetting::route('/create'),
            'edit' => Pages\EditContactSetting::route('/{record}/edit'),
        ];
    }
}
