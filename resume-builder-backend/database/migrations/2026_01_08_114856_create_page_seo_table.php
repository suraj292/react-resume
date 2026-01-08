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
        Schema::create('page_seo', function (Blueprint $table) {
            $table->id();
            
            // Page identification
            $table->string('page_route')->unique()->comment('Route identifier from frontend');
            $table->string('page_name')->comment('Human-readable page name');
            $table->boolean('is_published')->default(true);
            
            // Basic Meta Tags
            $table->string('meta_title', 60)->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            
            // Open Graph Tags
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('og_type')->default('website');
            $table->string('og_url')->nullable();
            
            // Twitter Card Tags
            $table->string('twitter_card')->default('summary_large_image');
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();
            $table->string('twitter_site')->nullable();
            $table->string('twitter_creator')->nullable();
            
            // Technical SEO
            $table->string('canonical_url')->nullable();
            $table->string('robots')->default('index, follow');
            $table->string('language')->default('en');
            $table->json('alternate_languages')->nullable();
            
            // Schema Markup
            $table->json('schema_markup')->nullable()->comment('JSON-LD structured data');
            
            // Additional Settings
            $table->integer('priority')->default(5)->comment('Display priority in admin');
            $table->text('notes')->nullable()->comment('Internal notes for admins');
            
            $table->timestamps();
            
            // Indexes
            $table->index('page_route');
            $table->index('is_published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_seo');
    }
};
