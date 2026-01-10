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
        Schema::table('resumes', function (Blueprint $table) {
            // Check if columns don't exist before adding them
            if (!Schema::hasColumn('resumes', 'template_id')) {
                $table->string('template_id')->default('modern')->after('data');
            }
            if (!Schema::hasColumn('resumes', 'color_id')) {
                $table->string('color_id')->default('indigo')->after('template_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resumes', function (Blueprint $table) {
            $table->dropColumn(['template_id', 'color_id']);
        });
    }
};
