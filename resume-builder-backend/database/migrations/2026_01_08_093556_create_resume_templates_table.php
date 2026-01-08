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
        Schema::create('resume_templates', function (Blueprint $table) {
            $table->id();
            $table->string('template_id')->unique(); // e.g., 'modern', 'creative'
            $table->string('name'); // Display name
            $table->string('category'); // e.g., 'Best for Tech & SaaS'
            $table->text('description')->nullable();
            $table->string('preview_image')->nullable(); // Path to preview image
            $table->string('thumbnail_image')->nullable(); // Path to thumbnail
            $table->json('supported_colors')->nullable(); // Array of supported color schemes
            $table->json('features')->nullable(); // Array of template features
            $table->boolean('is_active')->default(true);
            $table->boolean('is_premium')->default(false);
            $table->integer('sort_order')->default(0);
            $table->string('best_for')->nullable(); // Industry/role recommendation
            $table->string('complexity_level')->default('intermediate'); // beginner, intermediate, advanced
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resume_templates');
    }
};
