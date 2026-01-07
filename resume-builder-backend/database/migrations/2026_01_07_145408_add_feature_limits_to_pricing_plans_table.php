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
            // Feature limits (null = unlimited)
            $table->integer('max_resumes')->nullable()->after('features');
            $table->integer('max_templates')->nullable()->after('max_resumes');
            $table->integer('max_downloads_per_month')->nullable()->after('max_templates');
            $table->integer('max_ai_requests_per_month')->nullable()->after('max_downloads_per_month');
            
            // Export permissions
            $table->boolean('can_export_pdf')->default(false)->after('max_ai_requests_per_month');
            $table->boolean('can_export_docx')->default(false)->after('can_export_pdf');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pricing_plans', function (Blueprint $table) {
            $table->dropColumn([
                'max_resumes',
                'max_templates',
                'max_downloads_per_month',
                'max_ai_requests_per_month',
                'can_export_pdf',
                'can_export_docx',
            ]);
        });
    }
};
