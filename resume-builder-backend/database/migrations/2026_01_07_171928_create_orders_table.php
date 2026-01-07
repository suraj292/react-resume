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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique(); // Razorpay order ID
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Plan details
            $table->string('plan_slug');
            $table->string('plan_name');
            $table->enum('period', ['monthly', 'yearly']);
            $table->decimal('base_price', 10, 2);
            $table->decimal('gst_amount', 10, 2)->default(0);
            
            // Coupon details
            $table->foreignId('coupon_id')->nullable()->constrained()->onDelete('set null');
            $table->string('coupon_code')->nullable();
            $table->decimal('discount_amount', 10, 2)->default(0);
            
            // Payment details
            $table->decimal('total_amount', 10, 2);
            $table->string('currency', 3)->default('INR');
            $table->string('payment_id')->nullable(); // Razorpay payment ID
            $table->string('payment_signature')->nullable();
            $table->enum('payment_status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable(); // UPI, Card, NetBanking, etc.
            
            // Subscription validity
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_until')->nullable();
            
            // Additional info
            $table->string('phone_number')->nullable();
            $table->text('billing_address')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('order_id');
            $table->index('payment_status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
