<?php

namespace App\Console\Commands;

use App\Services\AIService;
use Illuminate\Console\Command;

class TestAIProvider extends Command
{
    protected $signature = 'ai:test';
    protected $description = 'Test AI provider configuration';

    public function handle(AIService $aiService)
    {
        $provider = config('services.ai.provider');
        
        $this->info("Testing AI Provider: {$provider}");
        $this->newLine();

        // Test resume parsing
        $testResume = <<<TEXT
John Doe
Senior Software Engineer
john.doe@example.com | +1 (555) 123-4567 | San Francisco, CA

EXPERIENCE
Software Engineer at Tech Corp
2020-01 to Present
Developed web applications using React and Node.js

EDUCATION
Bachelor of Science in Computer Science
Stanford University
2016 to 2020

SKILLS
JavaScript, React, Node.js, Python
TEXT;

        try {
            $this->info("Sending test resume to {$provider}...");
            $result = $aiService->parseResume($testResume);
            
            $this->newLine();
            $this->info("✅ SUCCESS! AI provider is working correctly.");
            $this->newLine();
            
            $this->info("Parsed Data:");
            $this->line(json_encode($result, JSON_PRETTY_PRINT));
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->newLine();
            $this->error("❌ FAILED! Error: " . $e->getMessage());
            $this->newLine();
            
            $this->warn("Configuration Check:");
            $this->line("Provider: " . config('services.ai.provider'));
            
            if ($provider === 'openai') {
                $this->line("OpenAI API Key: " . (config('services.openai.api_key') ? '✓ Set' : '✗ Not set'));
                $this->line("OpenAI Model: " . config('services.openai.model'));
            } else {
                $this->line("Gemini API Key: " . (config('services.gemini.api_key') ? '✓ Set' : '✗ Not set'));
                $this->line("Gemini Model: " . config('services.gemini.model'));
            }
            
            return Command::FAILURE;
        }
    }
}
