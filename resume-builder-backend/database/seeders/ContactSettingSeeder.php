<?php

namespace Database\Seeders;

use App\Models\ContactSetting;
use Illuminate\Database\Seeder;

class ContactSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'email_support',
                'label' => 'Email Support',
                'value' => 'support@resumeai.com',
                'type' => 'email',
                'icon' => 'fa-envelope',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'key' => 'phone_sales',
                'label' => 'Phone (Sales)',
                'value' => '+1 (555) 000-0000',
                'type' => 'phone',
                'icon' => 'fa-phone',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'key' => 'location',
                'label' => 'Headquarters',
                'value' => 'San Francisco, CA',
                'type' => 'text',
                'icon' => 'fa-location-dot',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'key' => 'support_hours',
                'label' => 'Support Hours',
                'value' => 'Mon-Fri from 9am to 6pm EST',
                'type' => 'text',
                'icon' => 'fa-clock',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'key' => 'response_time',
                'label' => 'Response Time',
                'value' => 'Our team typically responds within 24 hours',
                'type' => 'text',
                'icon' => 'fa-clock',
                'order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($settings as $setting) {
            ContactSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
