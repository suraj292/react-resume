<?php

namespace App\Services;

use OpenAI;
use Illuminate\Support\Facades\Http;

class AIService
{
    protected $provider;

    public function __construct()
    {
        $this->provider = config('services.ai.provider', 'openai');
    }

    /**
     * Parse resume text and extract structured data
     */
    public function parseResume(string $text): array
    {
        if ($this->provider === 'gemini') {
            return $this->parseResumeWithGemini($text);
        }

        return $this->parseResumeWithOpenAI($text);
    }

    /**
     * Parse job description and extract requirements
     */
    public function parseJobDescription(string $text): array
    {
        if ($this->provider === 'gemini') {
            return $this->parseJobDescriptionWithGemini($text);
        }

        return $this->parseJobDescriptionWithOpenAI($text);
    }

    /**
     * Generate content using AI (general purpose)
     */
    public function generateContent(string $prompt): string
    {
        if ($this->provider === 'gemini') {
            return $this->generateContentWithGemini($prompt);
        }

        return $this->generateContentWithOpenAI($prompt);
    }

    /**
     * Generate content using OpenAI
     */
    protected function generateContentWithOpenAI(string $prompt): string
    {
        $client = OpenAI::client(config('services.openai.api_key'));

        try {
            $response = $client->chat()->create([
                'model' => config('services.openai.model', 'gpt-4o'),
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant that provides structured data analysis.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.3,
                'max_tokens' => 2000,
            ]);

            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            \Log::error('OpenAI content generation failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Generate content using Gemini
     */
    protected function generateContentWithGemini(string $prompt): string
    {
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-pro');

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.3,
                    'maxOutputTokens' => 4096,
                ]
            ]);

            if (!$response->successful()) {
                throw new \Exception('Gemini API request failed: ' . $response->body());
            }

            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
        } catch (\Exception $e) {
            \Log::error('Gemini content generation failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Get the resume parsing prompt
     */
    protected function parseResumeWithOpenAI(string $text): array
    {
        $client = OpenAI::client(config('services.openai.api_key'));
        $prompt = $this->getResumeParsingPrompt($text);

        try {
            $response = $client->chat()->create([
                'model' => config('services.openai.model', 'gpt-4o'),
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a resume parser that extracts structured data from resume text. Always return valid JSON.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.3,
                'max_tokens' => 2000,
            ]);

            $content = $response->choices[0]->message->content;
            return $this->cleanAndParseJSON($content);
        } catch (\Exception $e) {
            \Log::error('OpenAI resume parsing failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Parse resume using Gemini
     */
    protected function parseResumeWithGemini(string $text): array
    {
        $prompt = $this->getResumeParsingPrompt($text);
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-pro');

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.3,
                    'maxOutputTokens' => 4096,
                ]
            ]);

            if (!$response->successful()) {
                throw new \Exception('Gemini API request failed: ' . $response->body());
            }

            $data = $response->json();
            $content = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            // Save raw response to file for debugging
            file_put_contents(storage_path('logs/gemini_raw_response.txt'), $content);
            \Log::info('Gemini response length: ' . strlen($content));
            
            return $this->cleanAndParseJSON($content);
        } catch (\Exception $e) {
            \Log::error('Gemini resume parsing failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Parse job description using OpenAI
     */
    protected function parseJobDescriptionWithOpenAI(string $text): array
    {
        $client = OpenAI::client(config('services.openai.api_key'));
        $prompt = $this->getJobDescriptionPrompt($text);

        try {
            $response = $client->chat()->create([
                'model' => config('services.openai.model', 'gpt-4o'),
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a job description analyzer. Always return valid JSON.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.3,
                'max_tokens' => 1000,
            ]);

            $content = $response->choices[0]->message->content;
            return $this->cleanAndParseJSON($content);
        } catch (\Exception $e) {
            \Log::error('OpenAI job description parsing failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Parse job description using Gemini
     */
    protected function parseJobDescriptionWithGemini(string $text): array
    {
        $prompt = $this->getJobDescriptionPrompt($text);
        $apiKey = config('services.gemini.api_key');
        $model = config('services.gemini.model', 'gemini-pro');

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.3,
                    'maxOutputTokens' => 4096,
                ]
            ]);

            if (!$response->successful()) {
                throw new \Exception('Gemini API request failed: ' . $response->body());
            }

            $data = $response->json();
            $content = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            return $this->cleanAndParseJSON($content);
        } catch (\Exception $e) {
            \Log::error('Gemini job description parsing failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Get the resume parsing prompt
     */
    protected function getResumeParsingPrompt(string $text): string
    {
        return <<<PROMPT
Extract structured information from this resume text. Return ONLY valid JSON matching this exact schema:

{
  "personal": {
    "name": "Full Name",
    "title": "Professional Title",
    "email": "email@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "City, State"
  },
  "summary": "Professional summary or objective",
  "experience": [
    {
      "id": "1",
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or null if current",
      "current": true/false,
      "description": "Job responsibilities and achievements"
    }
  ],
  "education": [
    {
      "id": "1",
      "institution": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "gpa": "3.8 (optional)"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"]
}

Resume text:
{$text}

Return ONLY the JSON, no explanations or markdown.
PROMPT;
    }

    /**
     * Get the job description parsing prompt
     */
    protected function getJobDescriptionPrompt(string $text): string
    {
        return <<<PROMPT
Extract key information from this job description:

{$text}

Return ONLY valid JSON with this structure:
{
  "title": "Job title",
  "company": "Company name",
  "required_skills": ["skill1", "skill2"],
  "preferred_skills": ["skill1", "skill2"],
  "experience_years": 5,
  "education_required": "Bachelor's degree",
  "keywords": ["keyword1", "keyword2"]
}
PROMPT;
    }

    /**
     * Clean and parse JSON response
     */
    protected function cleanAndParseJSON(string $content): array
    {
        // Remove markdown code blocks if present
        $content = preg_replace('/```json\s*/', '', $content);
        $content = preg_replace('/```\s*$/', '', $content);
        $content = preg_replace('/```/', '', $content);
        
        // Fix encoding issues - convert to UTF-8 and remove invalid characters
        $content = mb_convert_encoding($content, 'UTF-8', 'UTF-8');
        
        // Remove control characters EXCEPT newlines (\n), carriage returns (\r), and tabs (\t)
        $content = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $content);
        
        // Remove any remaining non-printable characters
        $content = preg_replace('/[^\P{C}\n\r\t]/u', '', $content);
        
        // Trim whitespace
        $content = trim($content);

        // Log the full cleaned content for debugging
        \Log::debug('Full cleaned AI response', ['content' => $content]);

        $parsed = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            \Log::error('JSON parse error', [
                'error' => json_last_error_msg(),
                'content' => $content // Log full content on error
            ]);
            throw new \Exception('Failed to parse AI response as JSON: ' . json_last_error_msg());
        }

        return $parsed;
    }
}
