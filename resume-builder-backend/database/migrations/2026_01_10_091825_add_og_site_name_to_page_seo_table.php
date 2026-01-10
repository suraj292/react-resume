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
        Schema::table('page_seo', function (Blueprint $table) {
            $table->string('og_site_name')->nullable()->after('og_url')->comment('Open Graph site name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('page_seo', function (Blueprint $table) {
            $table->dropColumn('og_site_name');
        });
    }
};
