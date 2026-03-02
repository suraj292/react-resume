<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PricingPlanSeeder::class,
            UserSeeder::class,
            ResumeSeeder::class,
            ResumeTemplateSeeder::class,
            PageSeoSeeder::class,
            BlogSeeder::class,
            ContactSettingSeeder::class,
            CouponSeeder::class,
            ResumeSeeder::class,
            TemplateAnalyticsSeeder::class,
        ]);
    }
}
