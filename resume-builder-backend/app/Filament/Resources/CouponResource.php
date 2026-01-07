<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CouponResource\Pages;
use App\Filament\Resources\CouponResource\RelationManagers;
use App\Models\Coupon;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;

class CouponResource extends Resource
{
    protected static ?string $model = Coupon::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    
    protected static ?string $navigationGroup = 'Sales & Marketing';
    
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Coupon Details')
                    ->description('Basic information about the coupon')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('code')
                                    ->label('Coupon Code')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255)
                                    ->placeholder('e.g., SAVE20')
                                    ->helperText('Unique code that users will enter')
                                    ->columnSpan(1)
                                    ->afterStateUpdated(fn ($state, callable $set) => $set('code', strtoupper($state))),
                                
                                Forms\Components\Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true)
                                    ->helperText('Toggle to enable/disable this coupon')
                                    ->columnSpan(1),
                            ]),
                        
                        Forms\Components\Textarea::make('description')
                            ->label('Description')
                            ->placeholder('Brief description of this coupon offer')
                            ->rows(2)
                            ->columnSpanFull(),
                    ]),

                Section::make('Discount Configuration')
                    ->description('Set the discount type and value')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Forms\Components\Select::make('type')
                                    ->label('Discount Type')
                                    ->options([
                                        'percentage' => 'Percentage',
                                        'fixed' => 'Fixed Amount',
                                    ])
                                    ->required()
                                    ->default('percentage')
                                    ->reactive()
                                    ->columnSpan(1),
                                
                                Forms\Components\TextInput::make('value')
                                    ->label(fn ($get) => $get('type') === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₹)')
                                    ->required()
                                    ->numeric()
                                    ->minValue(0)
                                    ->suffix(fn ($get) => $get('type') === 'percentage' ? '%' : '₹')
                                    ->helperText(fn ($get) => $get('type') === 'percentage' 
                                        ? 'Enter percentage (e.g., 20 for 20%)' 
                                        : 'Enter fixed amount in rupees')
                                    ->columnSpan(1),
                            ]),
                        
                        Forms\Components\TextInput::make('min_purchase_amount')
                            ->label('Minimum Purchase Amount (₹)')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('₹')
                            ->helperText('Leave empty for no minimum requirement')
                            ->placeholder('e.g., 499'),
                    ]),

                Section::make('Usage Limits')
                    ->description('Control how many times this coupon can be used')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Forms\Components\TextInput::make('max_uses')
                                    ->label('Total Max Uses')
                                    ->numeric()
                                    ->minValue(1)
                                    ->helperText('Leave empty for unlimited uses')
                                    ->placeholder('Unlimited'),
                                
                                Forms\Components\TextInput::make('max_uses_per_user')
                                    ->label('Max Uses Per User')
                                    ->required()
                                    ->numeric()
                                    ->minValue(1)
                                    ->default(1)
                                    ->helperText('How many times one user can use this'),
                                
                                Forms\Components\TextInput::make('current_uses')
                                    ->label('Current Uses')
                                    ->numeric()
                                    ->default(0)
                                    ->disabled()
                                    ->dehydrated(false)
                                    ->helperText('Auto-updated when coupon is used'),
                            ]),
                    ]),

                Section::make('Validity Period')
                    ->description('Set when this coupon is valid')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Forms\Components\DateTimePicker::make('valid_from')
                                    ->label('Valid From')
                                    ->helperText('Leave empty to start immediately')
                                    ->displayFormat('M d, Y h:i A')
                                    ->columnSpan(1),
                                
                                Forms\Components\DateTimePicker::make('valid_until')
                                    ->label('Valid Until')
                                    ->helperText('Leave empty for no expiration')
                                    ->displayFormat('M d, Y h:i A')
                                    ->columnSpan(1),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Code')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->copyable()
                    ->copyMessage('Coupon code copied!')
                    ->badge()
                    ->color('primary'),
                
                Tables\Columns\TextColumn::make('type')
                    ->label('Type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'percentage' => 'success',
                        'fixed' => 'warning',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),
                
                Tables\Columns\TextColumn::make('value')
                    ->label('Discount')
                    ->formatStateUsing(fn ($record): string => 
                        $record->type === 'percentage' 
                            ? $record->value . '%' 
                            : '₹' . number_format($record->value, 2)
                    )
                    ->weight(FontWeight::Bold)
                    ->color('success'),
                
                Tables\Columns\TextColumn::make('usage')
                    ->label('Usage')
                    ->formatStateUsing(fn ($record): string => 
                        $record->current_uses . ' / ' . ($record->max_uses ?? '∞')
                    )
                    ->description(fn ($record): string => 
                        'Max per user: ' . $record->max_uses_per_user
                    ),
                
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                
                Tables\Columns\TextColumn::make('valid_from')
                    ->label('Valid From')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->placeholder('Immediately')
                    ->toggleable(),
                
                Tables\Columns\TextColumn::make('valid_until')
                    ->label('Valid Until')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->placeholder('No expiration')
                    ->toggleable(),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('type')
                    ->options([
                        'percentage' => 'Percentage',
                        'fixed' => 'Fixed Amount',
                    ]),
                
                SelectFilter::make('is_active')
                    ->label('Status')
                    ->options([
                        '1' => 'Active',
                        '0' => 'Inactive',
                    ]),
                
                Filter::make('valid')
                    ->label('Currently Valid')
                    ->query(fn (Builder $query): Builder => 
                        $query->where('is_active', true)
                            ->where(function ($q) {
                                $q->whereNull('valid_from')
                                    ->orWhere('valid_from', '<=', now());
                            })
                            ->where(function ($q) {
                                $q->whereNull('valid_until')
                                    ->orWhere('valid_until', '>=', now());
                            })
                    ),
                
                Filter::make('expired')
                    ->label('Expired')
                    ->query(fn (Builder $query): Builder => 
                        $query->where('valid_until', '<', now())
                    ),
            ])
            ->actions([
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
            'index' => Pages\ListCoupons::route('/'),
            'create' => Pages\CreateCoupon::route('/create'),
            'edit' => Pages\EditCoupon::route('/{record}/edit'),
        ];
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_active', true)->count();
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }
}
