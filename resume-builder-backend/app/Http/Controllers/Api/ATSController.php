<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ATSController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Analyze resume for ATS compatibility
     */
    public function analyze(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resume_text' => 'required|string',
            'job_description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $resumeText = $request->input('resume_text');
        $jobDescription = $request->input('job_description');

        try {
            // Analyze keywords
            $keywords = $this->analyzeKeywords($resumeText, $jobDescription);
            
            // Analyze formatting
            $formatting = $this->analyzeFormatting($resumeText);
            
            // Analyze content quality
            $content = $this->analyzeContent($resumeText);
            
            // Calculate overall score
            $score = $this->calculateScore($keywords, $formatting, $content);
            
            // Generate recommendations
            $recommendations = $this->generateRecommendations($keywords, $formatting, $content);
            
            // Determine rating
            $rating = $this->getRating($score);

            return response()->json([
                'score' => $score,
                'rating' => $rating,
                'keywords' => $keywords,
                'formatting' => $formatting,
                'content' => $content,
                'recommendations' => $recommendations,
            ]);
        } catch (\Exception $e) {
            \Log::error('ATS analysis failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Analysis failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Analyze keywords using AI
     */
    protected function analyzeKeywords($resumeText, $jobDescription = null)
    {
        $prompt = "Extract all technical skills, soft skills, and job-relevant keywords from this resume. Return ONLY a JSON object with this exact structure (no markdown, no code blocks):\n\n";
        $prompt .= '{"skills": ["skill1", "skill2"], "technologies": ["tech1", "tech2"], "keywords": ["keyword1", "keyword2"]}';
        $prompt .= "\n\nResume:\n" . $resumeText;

        if ($jobDescription) {
            $prompt .= "\n\nAlso compare against this job description and identify missing keywords:\n" . $jobDescription;
        }

        $response = $this->aiService->generateContent($prompt);
        
        // Clean the response - remove markdown code blocks if present
        $cleanedResponse = preg_replace('/```json\s*|\s*```/', '', $response);
        $cleanedResponse = trim($cleanedResponse);
        
        $extracted = json_decode($cleanedResponse, true);

        if (!$extracted) {
            // Fallback: basic keyword extraction
            $words = str_word_count(strtolower($resumeText), 1);
            $filtered = array_filter($words, fn($w) => strlen($w) > 4);
            $extracted = [
                'skills' => array_slice(array_unique($filtered), 0, 10),
                'technologies' => [],
                'keywords' => []
            ];
        }

        $allKeywords = array_merge(
            $extracted['skills'] ?? [],
            $extracted['technologies'] ?? [],
            $extracted['keywords'] ?? []
        );

        $found = array_unique($allKeywords);
        
        // Simple missing keywords (common industry terms not found)
        $commonKeywords = ['leadership', 'management', 'python', 'javascript', 'aws', 'docker'];
        $missing = array_diff($commonKeywords, array_map('strtolower', $found));

        return [
            'found' => count($found),
            'missing' => count($missing),
            'found_list' => array_slice($found, 0, 15),
            'missing_list' => array_slice(array_values($missing), 0, 10),
        ];
    }

    /**
     * Analyze formatting issues
     */
    protected function analyzeFormatting($resumeText)
    {
        $issues = [];
        $issueCount = 0;

        // Check for email
        if (!preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $resumeText)) {
            $issues[] = [
                'type' => 'missing_email',
                'message' => 'Email address not found or not parseable',
                'severity' => 'error'
            ];
            $issueCount++;
        }

        // Check for phone
        if (!preg_match('/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/', $resumeText)) {
            $issues[] = [
                'type' => 'missing_phone',
                'message' => 'Phone number not found or not parseable',
                'severity' => 'error'
            ];
            $issueCount++;
        }

        // Check for standard sections
        $sections = ['experience', 'education', 'skills'];
        foreach ($sections as $section) {
            if (stripos($resumeText, $section) === false) {
                $issues[] = [
                    'type' => 'missing_section',
                    'message' => "Standard section '$section' not found",
                    'severity' => 'warning'
                ];
                $issueCount++;
            }
        }

        // Check for inconsistent date formats
        $dateFormats = [
            '/\d{1,2}\/\d{1,2}\/\d{2,4}/',  // MM/DD/YYYY
            '/\d{4}-\d{2}-\d{2}/',          // YYYY-MM-DD
            '/[A-Za-z]{3,9}\s+\d{4}/',      // Month Year
        ];

        $foundFormats = 0;
        foreach ($dateFormats as $format) {
            if (preg_match($format, $resumeText)) {
                $foundFormats++;
            }
        }

        if ($foundFormats > 1) {
            $issues[] = [
                'type' => 'inconsistent_dates',
                'message' => 'Multiple date formats detected - use consistent formatting',
                'severity' => 'warning'
            ];
            $issueCount++;
        }

        return [
            'issues' => $issueCount,
            'details' => $issues,
        ];
    }

    /**
     * Analyze content quality
     */
    protected function analyzeContent($resumeText)
    {
        $words = str_word_count($resumeText);
        
        // Action verbs analysis
        $actionVerbs = ['led', 'managed', 'developed', 'created', 'designed', 'implemented', 
                       'achieved', 'improved', 'increased', 'reduced', 'launched', 'built'];
        $actionVerbCount = 0;
        foreach ($actionVerbs as $verb) {
            $actionVerbCount += substr_count(strtolower($resumeText), $verb);
        }
        $actionVerbPercentage = min(100, ($actionVerbCount / max(1, $words / 100)) * 10);

        // Quantifiable results (numbers, percentages, dollar amounts)
        $quantifiableCount = preg_match_all('/\d+%|\$\d+|\d+\+/', $resumeText);
        $quantifiablePercentage = min(100, ($quantifiableCount / max(1, $words / 100)) * 15);

        // Bullet points analysis
        $bullets = substr_count($resumeText, '•') + substr_count($resumeText, '-');
        $avgBulletLength = $bullets > 0 ? (int)($words / $bullets) : 0;

        return [
            'action_verbs_percentage' => round($actionVerbPercentage),
            'quantifiable_results_percentage' => round($quantifiablePercentage),
            'word_count' => $words,
            'avg_bullet_length' => $avgBulletLength,
            'reading_level' => 'Grade 10-12', // Simplified
        ];
    }

    /**
     * Calculate overall ATS score
     */
    protected function calculateScore($keywords, $formatting, $content)
    {
        // Keywords: 40%
        $keywordScore = min(100, ($keywords['found'] / 15) * 100) * 0.4;
        
        // Formatting: 25%
        $formattingScore = max(0, (1 - ($formatting['issues'] / 10)) * 100) * 0.25;
        
        // Content: 20%
        $contentScore = (
            ($content['action_verbs_percentage'] * 0.5) +
            ($content['quantifiable_results_percentage'] * 0.5)
        ) * 0.2;
        
        // ATS Compatibility: 15% (if no critical issues)
        $atsScore = ($formatting['issues'] < 3 ? 100 : 50) * 0.15;

        return min(100, round($keywordScore + $formattingScore + $contentScore + $atsScore));
    }

    /**
     * Generate recommendations
     */
    protected function generateRecommendations($keywords, $formatting, $content)
    {
        $recommendations = [];

        if ($keywords['missing'] > 3) {
            $recommendations[] = "Add missing keywords: " . implode(', ', array_slice($keywords['missing_list'], 0, 5));
        }

        if ($formatting['issues'] > 0) {
            foreach ($formatting['details'] as $issue) {
                if ($issue['severity'] === 'error') {
                    $recommendations[] = $issue['message'];
                }
            }
        }

        if ($content['action_verbs_percentage'] < 50) {
            $recommendations[] = "Use more action verbs like 'Led', 'Managed', 'Developed' to start bullet points";
        }

        if ($content['quantifiable_results_percentage'] < 30) {
            $recommendations[] = "Add measurable results with numbers, percentages, or dollar amounts";
        }

        if (empty($recommendations)) {
            $recommendations[] = "Great job! Your resume is well-optimized for ATS systems";
        }

        return $recommendations;
    }

    /**
     * Get rating based on score
     */
    protected function getRating($score)
    {
        if ($score >= 85) return 'excellent';
        if ($score >= 70) return 'good';
        if ($score >= 50) return 'fair';
        return 'needs_improvement';
    }
}
