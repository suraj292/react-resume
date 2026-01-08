<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ResumeTemplate;

class TemplateAnalyticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all templates
        $templates = ResumeTemplate::all();
        
        if ($templates->isEmpty()) {
            $this->command->warn('No templates found. Please run ResumeTemplateSeeder first.');
            return;
        }

        // Generate random analytics data for the last 30 days
        $actions = ['select', 'preview'];
        $data = [];

        foreach ($templates as $template) {
            // Generate more data for popular templates
            $popularity = match($template->template_id) {
                'modern', 'professional', 'minimal' => rand(50, 100),
                'creative', 'tech', 'classic' => rand(30, 60),
                default => rand(10, 40),
            };

            for ($i = 0; $i < $popularity; $i++) {
                $action = $actions[array_rand($actions)];
                $daysAgo = rand(0, 30);
                
                $data[] = [
                    'resume_template_id' => $template->id,
                    'user_id' => null, // Set to null for demo data
                    'action' => $action,
                    'session_id' => 'session_' . uniqid(),
                    'ip_address' => rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255),
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'created_at' => now()->subDays($daysAgo)->subHours(rand(0, 23)),
                    'updated_at' => now()->subDays($daysAgo)->subHours(rand(0, 23)),
                ];
            }
        }

        // Insert in chunks to avoid memory issues
        foreach (array_chunk($data, 500) as $chunk) {
            DB::table('template_analytics')->insert($chunk);
        }

        $this->command->info('Generated ' . count($data) . ' analytics records for ' . $templates->count() . ' templates.');
    }
}
