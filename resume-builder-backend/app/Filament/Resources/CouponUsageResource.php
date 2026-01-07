<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CouponUsageResource\Pages;
use App\Models\CouponUsage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Filters\SelectFilter;

class CouponUsageResource extends Resource
{
    protected static ?string $model = CouponUsage::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';
    
    protected static ?string $navigationGroup = 'Sales & Marketing';
    
    protected static ?string $navigationLabel = 'Coupon Usage';
    
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('coupon_id')
                    ->relationship('coupon', 'code')
                    ->required()
                    ->searchable()
                    ->preload(),
                
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                
                Forms\Components\TextInput::make('order_id')
                    ->maxLength(255),
                
                Forms\Components\TextInput::make('discount_amount')
                    ->required()
                    ->numeric()
                    ->prefix('₹'),
                
                Forms\Components\DateTimePicker::make('used_at')
                    ->required()
                    ->default(now()),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('coupon.code')
                    ->label('Coupon Code')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->badge()
                    ->color('primary'),
                
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(),
                
                Tables\Columns\TextColumn::make('order_id')
                    ->label('Order ID')
                    ->searchable()
                    ->placeholder('N/A')
                    ->toggleable(),
                
                Tables\Columns\TextColumn::make('discount_amount')
                    ->label('Discount')
                    ->money('INR')
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->color('success'),
                
                Tables\Columns\TextColumn::make('used_at')
                    ->label('Used At')
                    ->dateTime('M d, Y h:i A')
                    ->sortable()
                    ->description(fn ($record) => $record->used_at->diffForHumans()),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('used_at', 'desc')
            ->filters([
                SelectFilter::make('coupon')
                    ->relationship('coupon', 'code')
                    ->searchable()
                    ->preload(),
                
                Tables\Filters\Filter::make('used_at')
                    ->form([
                        Forms\Components\DatePicker::make('used_from')
                            ->label('Used From'),
                        Forms\Components\DatePicker::make('used_until')
                            ->label('Used Until'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['used_from'], fn ($q, $date) => $q->whereDate('used_at', '>=', $date))
                            ->when($data['used_until'], fn ($q, $date) => $q->whereDate('used_at', '<=', $date));
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCouponUsages::route('/'),
        ];
    }
    
    public static function canCreate(): bool
    {
        return false; // Usage is created automatically when coupons are applied
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::whereDate('used_at', today())->count();
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        return 'info';
    }
}
