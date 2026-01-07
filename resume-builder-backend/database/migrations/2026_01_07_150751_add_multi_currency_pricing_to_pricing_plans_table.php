<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pricing_plans', function (Blueprint $table) {
            // USD prices (in cents)
            $table->integer('monthly_price_usd')->default(0)->after('currency');
            $table->integer('yearly_price_usd')->default(0)->after('monthly_price_usd');
            
            // INR prices (in paise) - rename existing columns
            $table->renameColumn('monthly_price', 'monthly_price_inr');
            $table->renameColumn('yearly_price', 'yearly_price_inr');
            
            // EUR prices (in cents)
            $table->integer('monthly_price_eur')->default(0)->after('yearly_price_inr');
            $table->integer('yearly_price_eur')->default(0)->after('monthly_price_eur');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pricing_plans', function (Blueprint $table) {
            // Rename back
            $table->renameColumn('monthly_price_inr', 'monthly_price');
            $table->renameColumn('yearly_price_inr', 'yearly_price');
            
            // Drop new columns
            $table->dropColumn([
                'monthly_price_usd',
                'yearly_price_usd',
                'monthly_price_eur',
                'yearly_price_eur',
            ]);
        });
    }
};
