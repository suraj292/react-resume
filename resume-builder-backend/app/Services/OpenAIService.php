<?php

namespace App\Services;

use OpenAI;

class OpenAIService
{
    protected $client;

    public function __construct()
    {
        $this->client = OpenAI::client(config('services.openai.api_key'));
    }

    /**
     * Parse resume text and extract structured data
     */
    public function parseResume(string $text): array
    {
        $prompt = $this->getResumeParsingPrompt($text);

        try {
            $response = $this->client->chat()->create([
                'model' => config('services.openai.model', 'gpt-4o'),
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a resume parser that extracts structured data from resume text. Always return valid JSON.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.3,
                'max_tokens' => 2000,
            ]);

            $content = $response->choices[0]->message->content;
            
            // Remove markdown code blocks if present
            $content = preg_replace('/```json\s*/', '', $content);
            $content = preg_replace('/```\s*$/', '', $content);
            
            $parsed = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Failed to parse OpenAI response as JSON');
            }

            return $parsed;
        } catch (\Exception $e) {
            \Log::error('OpenAI resume parsing failed', [
                'error' => $e->getMessage(),
                'text_length' => strlen($text),
            ]);
            throw $e;
        }
    }

    /**
     * Parse job description and extract requirements
     */
    public function parseJobDescription(string $text): array
    {
        $prompt = <<<PROMPT
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

        try {
            $response = $this->client->chat()->create([
                'model' => config('services.openai.model', 'gpt-4o'),
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a job description analyzer. Always return valid JSON.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.3,
                'max_tokens' => 1000,
            ]);

            $content = $response->choices[0]->message->content;
            $content = preg_replace('/```json\s*/', '', $content);
            $content = preg_replace('/```\s*$/', '', $content);
            
            return json_decode($content, true);
        } catch (\Exception $e) {
            \Log::error('OpenAI job description parsing failed', ['error' => $e->getMessage()]);
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
}
