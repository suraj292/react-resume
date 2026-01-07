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
        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Free, Pro, Career+
            $table->string('slug')->unique(); // free, pro, career-plus
            $table->text('description');
            $table->integer('monthly_price')->default(0); // in paise/cents
            $table->integer('yearly_price')->default(0); // in paise/cents
            $table->string('currency')->default('INR');
            $table->json('features'); // Array of features
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('button_text')->default('Get Started');
            $table->string('button_link')->default('#');
            $table->string('badge_text')->nullable(); // e.g., "MOST POPULAR"
            $table->string('theme')->default('light'); // light, dark
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};
