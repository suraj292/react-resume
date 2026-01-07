<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Illuminate\Database\Eloquent\Builder;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    
    protected static ?string $navigationGroup = 'Sales & Marketing';
    
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Order Information')
                    ->schema([
                        Forms\Components\TextInput::make('order_id')
                            ->label('Order ID')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\Select::make('payment_status')
                            ->options([
                                'pending' => 'Pending',
                                'completed' => 'Completed',
                                'failed' => 'Failed',
                                'refunded' => 'Refunded',
                            ])
                            ->required()
                            ->default('pending'),
                    ])->columns(3),

                Forms\Components\Section::make('Plan Details')
                    ->schema([
                        Forms\Components\TextInput::make('plan_slug')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('plan_name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('period')
                            ->options([
                                'monthly' => 'Monthly',
                                'yearly' => 'Yearly',
                            ])
                            ->required(),
                    ])->columns(3),

                Forms\Components\Section::make('Pricing')
                    ->schema([
                        Forms\Components\TextInput::make('base_price')
                            ->numeric()
                            ->prefix('INR')
                            ->required(),
                        Forms\Components\TextInput::make('gst_amount')
                            ->numeric()
                            ->prefix('INR')
                            ->default(0),
                        Forms\Components\TextInput::make('discount_amount')
                            ->numeric()
                            ->prefix('INR')
                            ->default(0),
                        Forms\Components\TextInput::make('total_amount')
                            ->numeric()
                            ->prefix('INR')
                            ->required(),
                    ])->columns(4),

                Forms\Components\Section::make('Coupon')
                    ->schema([
                        Forms\Components\Select::make('coupon_id')
                            ->relationship('coupon', 'code')
                            ->searchable()
                            ->preload(),
                        Forms\Components\TextInput::make('coupon_code')
                            ->maxLength(255),
                    ])->columns(2),

                Forms\Components\Section::make('Payment Details')
                    ->schema([
                        Forms\Components\TextInput::make('payment_id')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('payment_signature')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('payment_method')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('currency')
                            ->default('INR')
                            ->maxLength(3),
                    ])->columns(2),

                Forms\Components\Section::make('Validity Period')
                    ->schema([
                        Forms\Components\DateTimePicker::make('valid_from'),
                        Forms\Components\DateTimePicker::make('valid_until'),
                    ])->columns(2),

                Forms\Components\Section::make('Additional Information')
                    ->schema([
                        Forms\Components\TextInput::make('phone_number')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('billing_address')
                            ->rows(3),
                        Forms\Components\Textarea::make('notes')
                            ->rows(3),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_id')
                    ->label('Order ID')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->badge()
                    ->color('gray'),
                    
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable(),
                    
                Tables\Columns\TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                Tables\Columns\TextColumn::make('plan_name')
                    ->label('Plan')
                    ->badge()
                    ->color('info')
                    ->searchable(),
                    
                Tables\Columns\TextColumn::make('period')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'monthly' => 'warning',
                        'yearly' => 'success',
                    }),
                    
                Tables\Columns\TextColumn::make('total_amount')
                    ->label('Amount')
                    ->money('INR')
                    ->sortable(),
                    
                Tables\Columns\TextColumn::make('coupon_code')
                    ->label('Coupon')
                    ->badge()
                    ->color('purple')
                    ->default('—')
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('discount_amount')
                    ->label('Discount')
                    ->money('INR')
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                Tables\Columns\TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        'refunded' => 'info',
                    })
                    ->sortable(),
                    
                Tables\Columns\TextColumn::make('payment_method')
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->getStateUsing(fn (Order $record): bool => $record->isActive())
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('valid_until')
                    ->label('Expires')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Order Date')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ]),
                    
                Tables\Filters\SelectFilter::make('period')
                    ->options([
                        'monthly' => 'Monthly',
                        'yearly' => 'Yearly',
                    ]),
                    
                Tables\Filters\Filter::make('has_coupon')
                    ->label('With Coupon')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('coupon_code')),
                    
                Tables\Filters\Filter::make('active_subscriptions')
                    ->label('Active Only')
                    ->query(fn (Builder $query): Builder => $query
                        ->where('payment_status', 'completed')
                        ->where(function ($q) {
                            $q->whereNull('valid_until')
                                ->orWhere('valid_until', '>', now());
                        })
                    ),
                    
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from')
                            ->label('From'),
                        Forms\Components\DatePicker::make('created_until')
                            ->label('Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Order Summary')
                    ->schema([
                        Infolists\Components\TextEntry::make('order_id')
                            ->label('Order ID')
                            ->copyable()
                            ->badge()
                            ->color('gray'),
                        Infolists\Components\TextEntry::make('payment_status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'completed' => 'success',
                                'pending' => 'warning',
                                'failed' => 'danger',
                                'refunded' => 'info',
                            }),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Order Date')
                            ->dateTime(),
                    ])->columns(3),

                Infolists\Components\Section::make('Customer Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('user.name')
                            ->label('Name'),
                        Infolists\Components\TextEntry::make('user.email')
                            ->label('Email')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('phone_number')
                            ->label('Phone')
                            ->default('Not provided'),
                    ])->columns(3),

                Infolists\Components\Section::make('Plan Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('plan_name')
                            ->label('Plan')
                            ->badge()
                            ->color('info'),
                        Infolists\Components\TextEntry::make('period')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'monthly' => 'warning',
                                'yearly' => 'success',
                            }),
                        Infolists\Components\TextEntry::make('plan_slug')
                            ->label('Plan Slug'),
                    ])->columns(3),

                Infolists\Components\Section::make('Pricing Breakdown')
                    ->schema([
                        Infolists\Components\TextEntry::make('base_price')
                            ->label('Base Price (INR)')
                            ->numeric(decimalPlaces: 2),
                        Infolists\Components\TextEntry::make('gst_amount')
                            ->label('GST 18% (INR)')
                            ->numeric(decimalPlaces: 2),
                        Infolists\Components\TextEntry::make('discount_amount')
                            ->label('Discount (INR)')
                            ->numeric(decimalPlaces: 2)
                            ->color('success'),
                        Infolists\Components\TextEntry::make('total_amount')
                            ->label('Total Amount (INR)')
                            ->numeric(decimalPlaces: 2)
                            ->weight('bold')
                            ->size('lg'),
                    ])->columns(4),

                Infolists\Components\Section::make('Coupon Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('coupon_code')
                            ->label('Coupon Code')
                            ->badge()
                            ->color('purple')
                            ->default('No coupon used'),
                        Infolists\Components\TextEntry::make('coupon.type')
                            ->label('Discount Type')
                            ->default('N/A'),
                        Infolists\Components\TextEntry::make('discount_amount')
                            ->label('Discount Amount (INR)')
                            ->numeric(decimalPlaces: 2),
                    ])->columns(3)
                    ->visible(fn (Order $record): bool => $record->coupon_code !== null),

                Infolists\Components\Section::make('Payment Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('payment_id')
                            ->label('Payment ID')
                            ->copyable()
                            ->default('Pending'),
                        Infolists\Components\TextEntry::make('payment_method')
                            ->label('Payment Method')
                            ->badge()
                            ->default('Not specified'),
                        Infolists\Components\TextEntry::make('currency')
                            ->badge(),
                    ])->columns(3),

                Infolists\Components\Section::make('Subscription Validity')
                    ->schema([
                        Infolists\Components\TextEntry::make('valid_from')
                            ->label('Valid From')
                            ->dateTime()
                            ->default('Not set'),
                        Infolists\Components\TextEntry::make('valid_until')
                            ->label('Valid Until')
                            ->dateTime()
                            ->default('Lifetime')
                            ->color(fn ($state) => $state && now()->greaterThan($state) ? 'danger' : 'success'),
                        Infolists\Components\IconEntry::make('is_active')
                            ->label('Currently Active')
                            ->boolean()
                            ->getStateUsing(fn (Order $record): bool => $record->isActive()),
                    ])->columns(3),

                Infolists\Components\Section::make('Additional Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('billing_address')
                            ->default('Not provided'),
                        Infolists\Components\TextEntry::make('notes')
                            ->default('No notes'),
                    ])->columns(2)
                    ->collapsible(),
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
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('payment_status', 'pending')->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }
}
