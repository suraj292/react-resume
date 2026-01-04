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
        Schema::table('resume_uploads', function (Blueprint $table) {
            $table->integer('processing_progress')->default(0)->after('status');
            $table->json('parsing_errors')->nullable()->after('error_message');
            $table->decimal('confidence_score', 3, 2)->nullable()->after('parsing_errors');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resume_uploads', function (Blueprint $table) {
            $table->dropColumn(['processing_progress', 'parsing_errors', 'confidence_score']);
        });
    }
};
