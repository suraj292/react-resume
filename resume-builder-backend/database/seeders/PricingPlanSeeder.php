<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PricingPlan;

class PricingPlanSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'FREE',
                'slug' => 'free',
                'description' => 'Perfect for getting started with your first resume',
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 1,
                'button_text' => 'Get Started',
                'button_link' => '/auth/login',
                'badge_text' => null,
                'theme' => 'light',
                
                // Multi-currency pricing (in cents/paise)
                'monthly_price_usd' => 0,
                'yearly_price_usd' => 0,
                'monthly_price_inr' => 0,
                'yearly_price_inr' => 0,
                'monthly_price_eur' => 0,
                'yearly_price_eur' => 0,
                
                // Feature limits
                'max_resumes' => 1,
                'max_templates' => 4,
                'max_downloads_per_month' => 1,
                'max_ai_requests_per_month' => 2,
                'can_export_pdf' => true,
                'can_export_docx' => false,
                
                'features' => [
                    ['text' => '1 Resume', 'included' => true],
                    ['text' => '4 Templates', 'included' => true],
                    ['text' => '1 Download per month', 'included' => true],
                    ['text' => '2 AI Requests per month', 'included' => true],
                    ['text' => 'PDF Export', 'included' => true],
                    ['text' => 'DOCX Export', 'included' => false],
                ],
            ],
            
            [
                'name' => 'STARTER',
                'slug' => 'starter',
                'description' => 'Great for job seekers who need multiple resume versions',
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 2,
                'button_text' => 'Upgrade to Starter',
                'button_link' => '/pricing',
                'badge_text' => null,
                'theme' => 'light',
                
                // Multi-currency pricing (in cents/paise)
                'monthly_price_usd' => 799,      // $7.99
                'yearly_price_usd' => 5999,      // $59.99
                'monthly_price_inr' => 19900,    // ₹199
                'yearly_price_inr' => 199900,    // ₹1,999
                'monthly_price_eur' => 699,      // €6.99
                'yearly_price_eur' => 5999,      // €59.99
                
                // Feature limits
                'max_resumes' => 3,
                'max_templates' => 10,
                'max_downloads_per_month' => 10,
                'max_ai_requests_per_month' => 10,
                'can_export_pdf' => true,
                'can_export_docx' => true,
                
                'features' => [
                    ['text' => '3 Resumes', 'included' => true],
                    ['text' => '10 Templates', 'included' => true],
                    ['text' => '10 Downloads per month', 'included' => true],
                    ['text' => '10 AI Requests per month', 'included' => true],
                    ['text' => 'PDF Export', 'included' => true],
                    ['text' => 'DOCX Export', 'included' => true],
                ],
            ],
            
            [
                'name' => 'PROFESSIONAL',
                'slug' => 'professional',
                'description' => 'Best for professionals managing multiple career opportunities',
                'is_popular' => true,
                'is_active' => true,
                'sort_order' => 3,
                'button_text' => 'Go Professional',
                'button_link' => '/pricing',
                'badge_text' => 'MOST POPULAR',
                'theme' => 'dark',
                
                // Multi-currency pricing (in cents/paise)
                'monthly_price_usd' => 1499,     // $14.99
                'yearly_price_usd' => 11999,     // $119.99
                'monthly_price_inr' => 39900,    // ₹399
                'yearly_price_inr' => 399900,    // ₹3,999
                'monthly_price_eur' => 1299,     // €12.99
                'yearly_price_eur' => 11999,     // €119.99
                
                // Feature limits
                'max_resumes' => 10,
                'max_templates' => 22,
                'max_downloads_per_month' => 50,
                'max_ai_requests_per_month' => 50,
                'can_export_pdf' => true,
                'can_export_docx' => true,
                
                'features' => [
                    ['text' => '10 Resumes', 'included' => true],
                    ['text' => '22 Templates', 'included' => true],
                    ['text' => '50 Downloads per month', 'included' => true],
                    ['text' => '50 AI Requests per month', 'included' => true],
                    ['text' => 'PDF Export', 'included' => true],
                    ['text' => 'DOCX Export', 'included' => true],
                    ['text' => 'Priority Support', 'included' => true],
                ],
            ],
            
            [
                'name' => 'UNLIMITED',
                'slug' => 'unlimited',
                'description' => 'Everything you need with no limits - perfect for power users',
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 4,
                'button_text' => 'Go Unlimited',
                'button_link' => '/pricing',
                'badge_text' => 'BEST VALUE',
                'theme' => 'dark',
                
                // Multi-currency pricing (in cents/paise)
                'monthly_price_usd' => 2499,     // $24.99
                'yearly_price_usd' => 19999,     // $199.99
                'monthly_price_inr' => 69900,    // ₹699
                'yearly_price_inr' => 699900,    // ₹6,999
                'monthly_price_eur' => 1999,     // €19.99
                'yearly_price_eur' => 17999,     // €179.99
                
                // Feature limits (null = unlimited)
                'max_resumes' => null,
                'max_templates' => null,
                'max_downloads_per_month' => null,
                'max_ai_requests_per_month' => null,
                'can_export_pdf' => true,
                'can_export_docx' => true,
                
                'features' => [
                    ['text' => 'Unlimited Resumes', 'included' => true],
                    ['text' => 'All Templates (22+)', 'included' => true],
                    ['text' => 'Unlimited Downloads', 'included' => true],
                    ['text' => 'Unlimited AI Requests', 'included' => true],
                    ['text' => 'PDF Export', 'included' => true],
                    ['text' => 'DOCX Export', 'included' => true],
                    ['text' => 'Priority Support', 'included' => true],
                    ['text' => 'Early Access to New Features', 'included' => true],
                ],
            ],
        ];

        foreach ($plans as $plan) {
            PricingPlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
