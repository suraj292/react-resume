<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Coupon;
use Carbon\Carbon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'SAVE20',
                'type' => 'percentage',
                'value' => 20,
                'description' => '20% off on all plans',
                'max_uses' => null, // Unlimited
                'max_uses_per_user' => 1, // Single use per user
                'current_uses' => 0,
                'min_purchase_amount' => null,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::now()->addMonths(3),
                'is_active' => true,
            ],
            [
                'code' => 'WELCOME10',
                'type' => 'percentage',
                'value' => 10,
                'description' => '10% off for new users',
                'max_uses' => 1000,
                'max_uses_per_user' => 1,
                'current_uses' => 0,
                'min_purchase_amount' => null,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::now()->addYear(),
                'is_active' => true,
            ],
            [
                'code' => 'FLAT100',
                'type' => 'fixed',
                'value' => 100,
                'description' => '₹100 flat discount',
                'max_uses' => 500,
                'max_uses_per_user' => 1,
                'current_uses' => 0,
                'min_purchase_amount' => 499,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::now()->addMonths(6),
                'is_active' => true,
            ],
            [
                'code' => 'REPEAT15',
                'type' => 'percentage',
                'value' => 15,
                'description' => '15% off - can be used 3 times per user',
                'max_uses' => null,
                'max_uses_per_user' => 3, // Multi-use per user
                'current_uses' => 0,
                'min_purchase_amount' => null,
                'valid_from' => Carbon::now(),
                'valid_until' => Carbon::now()->addMonths(12),
                'is_active' => true,
            ],
        ];

        foreach ($coupons as $coupon) {
            Coupon::updateOrCreate(
                ['code' => $coupon['code']],
                $coupon
            );
        }

        $this->command->info('Coupons seeded successfully!');
    }
}
