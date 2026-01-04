<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Resume;

class ResumeSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'demo@resumeai.com')->first();

        if (!$user) {
            $this->command->error('Demo user not found. Run UserSeeder first.');
            return;
        }

        Resume::create([
            'user_id' => $user->id,
            'title' => 'Software Engineer Resume',
            'template_id' => 'modern',
            'color_id' => 'indigo',
            'data' => [
                'personal' => [
                    'name' => 'Jonathan Doe',
                    'title' => 'Senior Software Engineer',
                    'email' => 'jonathan.doe@example.com',
                    'phone' => '+1 (555) 123-4567',
                    'location' => 'New York, NY',
                ],
                'summary' => 'Experienced software engineer with 10+ years building scalable web applications.',
                'experience' => [
                    [
                        'id' => '1',
                        'company' => 'TechCorp',
                        'position' => 'Principal Engineer',
                        'startDate' => '2021-01',
                        'endDate' => null,
                        'current' => true,
                        'description' => 'Led the migration of legacy infrastructure to modern microservices architecture.',
                    ],
                    [
                        'id' => '2',
                        'company' => 'StartupXYZ',
                        'position' => 'Senior Developer',
                        'startDate' => '2018-06',
                        'endDate' => '2020-12',
                        'current' => false,
                        'description' => 'Built and scaled the core platform serving 1M+ users.',
                    ],
                ],
                'education' => [
                    [
                        'id' => '1',
                        'institution' => 'Stanford University',
                        'degree' => 'B.S. Computer Science',
                        'field' => 'Computer Science',
                        'startDate' => '2013',
                        'endDate' => '2017',
                        'gpa' => '3.8',
                    ],
                ],
                'skills' => [
                    'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Redis'
                ],
            ],
        ]);

        $this->command->info('Demo resume created successfully!');
    }
}
