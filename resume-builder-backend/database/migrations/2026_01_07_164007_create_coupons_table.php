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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('value', 10, 2); // Percentage (e.g., 20 for 20%) or fixed amount in smallest unit
            $table->text('description')->nullable();
            $table->integer('max_uses')->nullable(); // null = unlimited uses
            $table->integer('max_uses_per_user')->default(1); // How many times a single user can use it
            $table->integer('current_uses')->default(0);
            $table->decimal('min_purchase_amount', 10, 2)->nullable(); // Minimum purchase amount in smallest unit
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
