<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EnquiryResource\Pages;
use App\Models\Enquiry;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Filament\Infolists\Infolist;

class EnquiryResource extends Resource
{
    protected static ?string $model = Enquiry::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';
    
    protected static ?string $navigationLabel = 'Enquiries';
    
    protected static ?string $navigationGroup = 'Contact';
    
    protected static ?int $navigationSort = 2;
    
    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Enquiry Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(1),
                            
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(1),
                            
                        Forms\Components\TextInput::make('subject')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                            
                        Forms\Components\Textarea::make('message')
                            ->required()
                            ->rows(5)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                    
                Forms\Components\Section::make('Status & Notes')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->required()
                            ->options([
                                'new' => 'New',
                                'read' => 'Read',
                                'replied' => 'Replied',
                                'closed' => 'Closed',
                            ])
                            ->default('new')
                            ->columnSpan(1),
                            
                        Forms\Components\DateTimePicker::make('read_at')
                            ->label('Read At')
                            ->columnSpan(1),
                            
                        Forms\Components\DateTimePicker::make('replied_at')
                            ->label('Replied At')
                            ->columnSpan(1),
                            
                        Forms\Components\Textarea::make('admin_notes')
                            ->rows(4)
                            ->columnSpanFull()
                            ->helperText('Internal notes (not visible to user)'),
                    ])
                    ->columns(2),
                    
                Forms\Components\Section::make('Metadata')
                    ->schema([
                        Forms\Components\TextInput::make('ip_address')
                            ->label('IP Address')
                            ->disabled()
                            ->columnSpan(1),
                            
                        Forms\Components\Textarea::make('user_agent')
                            ->label('User Agent')
                            ->disabled()
                            ->rows(2)
                            ->columnSpan(1),
                    ])
                    ->columns(2)
                    ->collapsible()
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                    
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->icon('heroicon-m-envelope'),
                    
                Tables\Columns\TextColumn::make('subject')
                    ->searchable()
                    ->limit(40)
                    ->tooltip(function (Tables\Columns\TextColumn $column): ?string {
                        $state = $column->getState();
                        if (strlen($state) <= 40) {
                            return null;
                        }
                        return $state;
                    }),
                    
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => 'new',
                        'info' => 'read',
                        'warning' => 'replied',
                        'danger' => 'closed',
                    ])
                    ->icons([
                        'heroicon-o-sparkles' => 'new',
                        'heroicon-o-eye' => 'read',
                        'heroicon-o-chat-bubble-left-right' => 'replied',
                        'heroicon-o-check-circle' => 'closed',
                    ]),
                    
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Submitted')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->description(fn (Enquiry $record): string => $record->created_at->format('M d, Y h:i A')),
                    
                Tables\Columns\IconColumn::make('read_at')
                    ->label('Read')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->alignCenter(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'new' => 'New',
                        'read' => 'Read',
                        'replied' => 'Replied',
                        'closed' => 'Closed',
                    ])
                    ->multiple(),
                    
                Tables\Filters\Filter::make('unread')
                    ->query(fn ($query) => $query->whereNull('read_at'))
                    ->toggle(),
                    
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from')
                            ->label('From'),
                        Forms\Components\DatePicker::make('created_until')
                            ->label('Until'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['created_from'], fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
                            ->when($data['created_until'], fn ($q, $date) => $q->whereDate('created_at', '<=', $date));
                    }),
            ])
            ->actions([
                Tables\Actions\Action::make('markAsRead')
                    ->label('Mark as Read')
                    ->icon('heroicon-o-eye')
                    ->color('info')
                    ->visible(fn (Enquiry $record) => !$record->read_at)
                    ->action(fn (Enquiry $record) => $record->markAsRead())
                    ->requiresConfirmation(false),
                    
                Tables\Actions\Action::make('markAsReplied')
                    ->label('Mark as Replied')
                    ->icon('heroicon-o-chat-bubble-left-right')
                    ->color('warning')
                    ->visible(fn (Enquiry $record) => $record->status !== 'replied')
                    ->action(fn (Enquiry $record) => $record->markAsReplied())
                    ->requiresConfirmation(false),
                    
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('markAsRead')
                        ->label('Mark as Read')
                        ->icon('heroicon-o-eye')
                        ->color('info')
                        ->action(function ($records) {
                            $records->each->markAsRead();
                        }),
                        
                    Tables\Actions\BulkAction::make('markAsReplied')
                        ->label('Mark as Replied')
                        ->icon('heroicon-o-chat-bubble-left-right')
                        ->color('warning')
                        ->action(function ($records) {
                            $records->each->markAsReplied();
                        }),
                        
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->poll('30s'); // Auto-refresh every 30 seconds
    }
    
    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Contact Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('name')
                            ->icon('heroicon-o-user'),
                        Infolists\Components\TextEntry::make('email')
                            ->icon('heroicon-o-envelope')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('subject')
                            ->icon('heroicon-o-document-text')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
                    
                Infolists\Components\Section::make('Message')
                    ->schema([
                        Infolists\Components\TextEntry::make('message')
                            ->prose()
                            ->columnSpanFull(),
                    ]),
                    
                Infolists\Components\Section::make('Status & Timeline')
                    ->schema([
                        Infolists\Components\TextEntry::make('status')
                            ->badge()
                            ->color(fn (string $state): string => match ($state) {
                                'new' => 'success',
                                'read' => 'info',
                                'replied' => 'warning',
                                'closed' => 'danger',
                                default => 'gray',
                            }),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Submitted At')
                            ->dateTime(),
                        Infolists\Components\TextEntry::make('read_at')
                            ->label('Read At')
                            ->dateTime()
                            ->placeholder('Not read yet'),
                        Infolists\Components\TextEntry::make('replied_at')
                            ->label('Replied At')
                            ->dateTime()
                            ->placeholder('Not replied yet'),
                    ])
                    ->columns(2),
                    
                Infolists\Components\Section::make('Admin Notes')
                    ->schema([
                        Infolists\Components\TextEntry::make('admin_notes')
                            ->prose()
                            ->placeholder('No notes added')
                            ->columnSpanFull(),
                    ])
                    ->collapsible(),
                    
                Infolists\Components\Section::make('Technical Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('ip_address')
                            ->label('IP Address')
                            ->copyable(),
                        Infolists\Components\TextEntry::make('user_agent')
                            ->label('User Agent')
                            ->columnSpanFull(),
                    ])
                    ->columns(2)
                    ->collapsible()
                    ->collapsed(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEnquiries::route('/'),
            'create' => Pages\CreateEnquiry::route('/create'),
            'view' => Pages\ViewEnquiry::route('/{record}'),
            'edit' => Pages\EditEnquiry::route('/{record}/edit'),
        ];
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'new')->count() ?: null;
    }
    
    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }
}
