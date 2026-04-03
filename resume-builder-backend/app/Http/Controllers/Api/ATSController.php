<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use App\Traits\TracksUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ATSController extends Controller
{
    use TracksUsage;

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
        $hasJobDescription = !empty($jobDescription);

        try {
            // Extract keywords from resume using AI
            $resumeKeywords = $this->extractResumeKeywordsEnhanced($resumeText);
            
            // Analyze keywords (with or without job description)
            if ($hasJobDescription) {
                $keywords = $this->compareWithJobDescription($resumeKeywords, $jobDescription, $resumeText);
            } else {
                $keywords = $this->analyzeKeywordsWithoutJob($resumeKeywords, $resumeText);
            }
            
            // Analyze formatting
            $formatting = $this->analyzeFormatting($resumeText);
            
            // Analyze content quality
            $content = $this->analyzeContentEnhanced($resumeText);
            
            // Calculate overall score (more realistic)
            $score = $this->calculateScoreRealistic($keywords, $formatting, $content, $hasJobDescription);
            
            // Generate recommendations
            $recommendations = $this->generateRecommendationsEnhanced($keywords, $formatting, $content, $hasJobDescription);
            
            // Determine rating
            $rating = $this->getRating($score);

            // Track usage so monthly counters are accurate
            $this->trackAIRequest(
                $request->user()->id,
                'ats_analysis',
                null,
                null,
                null,
                null,
                'success'
            );

            return response()->json([
                'score' => $score,
                'rating' => $rating,
                'keywords' => $keywords,
                'formatting' => $formatting,
                'content' => $content,
                'recommendations' => $recommendations,
                'has_job_description' => $hasJobDescription,
            ]);
        } catch (\Exception $e) {
            // Track failed attempt too so usage stays consistent
            $this->trackAIRequest(
                $request->user()->id,
                'ats_analysis',
                null,
                null,
                null,
                null,
                'error',
                $e->getMessage()
            );

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
     * Enhanced keyword extraction with better parsing
     */
    protected function extractResumeKeywordsEnhanced($resumeText)
    {
        // First, do basic extraction as fallback
        $basicKeywords = $this->extractBasicKeywords($resumeText);
        
        try {
            $prompt = <<<PROMPT
Analyze this resume and extract ALL relevant keywords and skills.

Resume:
{$resumeText}

Return ONLY a JSON object (no markdown, no code blocks):
{
  "technical_skills": ["Laravel", "PHP", "React"],
  "tools_technologies": ["Docker", "MySQL", "Redis"],
  "soft_skills": ["Leadership", "Communication"],
  "certifications": ["AWS Certified"],
  "methodologies": ["Agile", "SOLID", "Clean Architecture"],
  "action_verbs": ["Led", "Improved", "Developed"]
}

Extract EVERYTHING you find. Be comprehensive.
PROMPT;

            $response = $this->aiService->generateContent($prompt);
            
            // Clean response
            $cleanedResponse = $this->cleanAIResponse($response);
            
            \Log::info('AI Keyword Extraction', [
                'raw_length' => strlen($response),
                'cleaned_length' => strlen($cleanedResponse),
                'preview' => substr($cleanedResponse, 0, 200)
            ]);
            
            $extracted = json_decode($cleanedResponse, true);

            if (!$extracted || json_last_error() !== JSON_ERROR_NONE) {
                \Log::warning('AI extraction failed, using basic', [
                    'json_error' => json_last_error_msg()
                ]);
                return $basicKeywords;
            }

            return $extracted;
        } catch (\Exception $e) {
            \Log::error('AI keyword extraction error', ['error' => $e->getMessage()]);
            return $basicKeywords;
        }
    }

    /**
     * Basic keyword extraction (fallback)
     */
    protected function extractBasicKeywords($resumeText)
    {
        // Common tech keywords
        $techKeywords = ['laravel', 'php', 'react', 'vue', 'next.js', 'mysql', 'postgresql', 
                        'mongodb', 'redis', 'docker', 'aws', 'nginx', 'api', 'rest', 
                        'microservices', 'tailwind', 'redux', 'zustand', 'github', 'ci/cd'];
        
        $found = [];
        $lowerText = strtolower($resumeText);
        
        foreach ($techKeywords as $keyword) {
            if (stripos($lowerText, $keyword) !== false) {
                $found[] = ucfirst($keyword);
            }
        }
        
        return [
            'technical_skills' => array_slice($found, 0, 15),
            'tools_technologies' => [],
            'soft_skills' => [],
            'certifications' => [],
            'methodologies' => [],
            'action_verbs' => $this->extractActionVerbs($resumeText)
        ];
    }

    /**
     * Extract action verbs from text
     */
    protected function extractActionVerbs($text)
    {
        $actionVerbs = [
            'led', 'managed', 'directed', 'supervised', 'coordinated', 'oversaw',
            'achieved', 'accomplished', 'delivered', 'exceeded', 'surpassed',
            'created', 'developed', 'designed', 'built', 'established', 'launched',
            'improved', 'enhanced', 'optimized', 'streamlined', 'upgraded',
            'increased', 'grew', 'expanded', 'boosted', 'scaled',
            'reduced', 'decreased', 'minimized', 'eliminated', 'saved',
            'implemented', 'deployed', 'configured', 'integrated', 'automated',
            'analyzed', 'evaluated', 'assessed', 'researched', 'investigated'
        ];
        
        $found = [];
        $lowerText = strtolower($text);
        
        foreach ($actionVerbs as $verb) {
            if (stripos($lowerText, $verb) !== false) {
                $found[] = ucfirst($verb);
            }
        }
        
        return array_unique($found);
    }

    /**
     * Clean AI response
     */
    protected function cleanAIResponse($response)
    {
        // Remove markdown code blocks
        $cleaned = preg_replace('/```json\s*/i', '', $response);
        $cleaned = preg_replace('/```\s*/', '', $cleaned);
        $cleaned = trim($cleaned);
        
        // Try to extract JSON if embedded in text
        if (preg_match('/\{.*\}/s', $cleaned, $matches)) {
            $cleaned = $matches[0];
        }
        
        return $cleaned;
    }

    /**
     * Analyze keywords without job description
     */
    protected function analyzeKeywordsWithoutJob($resumeKeywords, $resumeText)
    {
        $allKeywords = array_merge(
            $resumeKeywords['technical_skills'] ?? [],
            $resumeKeywords['tools_technologies'] ?? [],
            $resumeKeywords['soft_skills'] ?? [],
            $resumeKeywords['certifications'] ?? [],
            $resumeKeywords['methodologies'] ?? []
        );

        $found = array_unique($allKeywords);
        
        // Suggest missing industry-standard keywords based on what's found
        $suggested = $this->suggestMissingKeywords($found, $resumeText);

        return [
            'found' => count($found),
            'missing' => count($suggested),
            'found_list' => array_slice($found, 0, 20),
            'missing_list' => $suggested,
            'match_percentage' => null,
            'strength' => null,
        ];
    }

    /**
     * Suggest missing keywords based on resume content
     */
    protected function suggestMissingKeywords($foundKeywords, $resumeText)
    {
        $suggestions = [];
        $lowerText = strtolower($resumeText);
        $foundLower = array_map('strtolower', $foundKeywords);
        
        // If Laravel is found, suggest related keywords
        if (in_array('laravel', $foundLower)) {
            $laravelRelated = ['PHPUnit', 'Eloquent', 'Artisan', 'Composer', 'Blade'];
            foreach ($laravelRelated as $keyword) {
                if (!in_array(strtolower($keyword), $foundLower) && stripos($lowerText, $keyword) === false) {
                    $suggestions[] = $keyword;
                }
            }
        }
        
        // If React is found, suggest related
        if (in_array('react', $foundLower) || in_array('next.js', $foundLower)) {
            $reactRelated = ['TypeScript', 'Jest', 'Testing Library', 'Webpack'];
            foreach ($reactRelated as $keyword) {
                if (!in_array(strtolower($keyword), $foundLower) && stripos($lowerText, $keyword) === false) {
                    $suggestions[] = $keyword;
                }
            }
        }
        
        // General suggestions
        $general = ['Unit Testing', 'API Documentation', 'Code Review', 'Agile', 'Git', 'Security Best Practices'];
        foreach ($general as $keyword) {
            if (!in_array(strtolower($keyword), $foundLower) && stripos($lowerText, $keyword) === false) {
                $suggestions[] = $keyword;
            }
        }
        
        return array_slice($suggestions, 0, 8);
    }

    /**
     * Compare with job description
     */
    protected function compareWithJobDescription($resumeKeywords, $jobDescription, $resumeText)
    {
        $allResumeKeywords = array_merge(
            $resumeKeywords['technical_skills'] ?? [],
            $resumeKeywords['tools_technologies'] ?? [],
            $resumeKeywords['soft_skills'] ?? [],
            $resumeKeywords['certifications'] ?? [],
            $resumeKeywords['methodologies'] ?? []
        );

        try {
            $resumeKeywordsJson = json_encode($allResumeKeywords);
            
            $prompt = <<<PROMPT
Compare resume keywords against job description.

Resume Keywords: {$resumeKeywordsJson}
Job Description: {$jobDescription}

Return ONLY JSON (no markdown):
{
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_critical": ["must-have1", "must-have2"],
  "missing_preferred": ["nice-to-have1"],
  "match_percentage": 75
}
PROMPT;

            $response = $this->aiService->generateContent($prompt);
            $cleaned = $this->cleanAIResponse($response);
            $comparison = json_decode($cleaned, true);

            if (!$comparison) {
                throw new \Exception('Failed to parse comparison');
            }

            return [
                'found' => count($comparison['matched_keywords'] ?? []),
                'missing' => count($comparison['missing_critical'] ?? []) + count($comparison['missing_preferred'] ?? []),
                'found_list' => array_slice($comparison['matched_keywords'] ?? [], 0, 20),
                'missing_list' => array_merge(
                    array_slice($comparison['missing_critical'] ?? [], 0, 5),
                    array_slice($comparison['missing_preferred'] ?? [], 0, 5)
                ),
                'match_percentage' => $comparison['match_percentage'] ?? 70,
                'strength' => $this->getStrength($comparison['match_percentage'] ?? 70),
                'missing_critical' => $comparison['missing_critical'] ?? [],
                'missing_preferred' => $comparison['missing_preferred'] ?? [],
            ];
        } catch (\Exception $e) {
            \Log::error('Job comparison failed', ['error' => $e->getMessage()]);
            
            // Fallback
            return [
                'found' => count($allResumeKeywords),
                'missing' => 0,
                'found_list' => array_slice($allResumeKeywords, 0, 20),
                'missing_list' => [],
                'match_percentage' => 75,
                'strength' => 'moderate',
            ];
        }
    }

    /**
     * Get strength rating from percentage
     */
    protected function getStrength($percentage)
    {
        if ($percentage >= 80) return 'strong';
        if ($percentage >= 60) return 'moderate';
        return 'weak';
    }

    /**
     * Enhanced content analysis
     */
    protected function analyzeContentEnhanced($resumeText)
    {
        $words = str_word_count($resumeText);
        
        // Expanded action verbs
        $actionVerbs = [
            'led', 'managed', 'directed', 'supervised', 'coordinated', 'oversaw', 'guided', 'mentored',
            'achieved', 'accomplished', 'attained', 'exceeded', 'surpassed', 'delivered', 'completed',
            'created', 'developed', 'designed', 'built', 'established', 'founded', 'launched', 'initiated',
            'improved', 'enhanced', 'optimized', 'streamlined', 'upgraded', 'modernized', 'transformed',
            'increased', 'grew', 'expanded', 'boosted', 'accelerated', 'scaled', 'maximized',
            'reduced', 'decreased', 'minimized', 'eliminated', 'cut', 'saved', 'lowered',
            'implemented', 'deployed', 'configured', 'integrated', 'automated', 'programmed', 'engineered',
            'analyzed', 'evaluated', 'assessed', 'researched', 'investigated', 'examined', 'studied',
            'presented', 'communicated', 'collaborated', 'negotiated', 'facilitated', 'coordinated',
            'architected', 'spearheaded', 'orchestrated', 'pioneered', 'championed'
        ];
        
        $actionVerbCount = 0;
        $lowerText = strtolower($resumeText);
        foreach ($actionVerbs as $verb) {
            $actionVerbCount += substr_count($lowerText, $verb);
        }
        
        // More realistic percentage calculation
        $sentences = preg_split('/[.!?]+/', $resumeText, -1, PREG_SPLIT_NO_EMPTY);
        $sentenceCount = count($sentences);
        $actionVerbPercentage = $sentenceCount > 0 ? min(100, ($actionVerbCount / $sentenceCount) * 100) : 0;

        // Enhanced quantifiable results detection
        $quantifiablePatterns = [
            '/\d+%/',                    // 25%
            '/\$\d+[KMB]?/',            // $50K
            '/\d+x/',                    // 3x
            '/\d+\+/',                   // 100+
            '/increased.*?\d+/i',        // increased by 20
            '/reduced.*?\d+/i',          // reduced by 30
            '/improved.*?\d+/i',         // improved by 40
            '/grew.*?\d+/i',             // grew by 50
            '/saved.*?\d+/i',            // saved 100 hours
        ];
        
        $quantifiableCount = 0;
        foreach ($quantifiablePatterns as $pattern) {
            $quantifiableCount += preg_match_all($pattern, $resumeText);
        }
        
        $quantifiablePercentage = $sentenceCount > 0 ? min(100, ($quantifiableCount / $sentenceCount) * 100) : 0;

        // Bullet points
        $bullets = substr_count($resumeText, '•') + substr_count($resumeText, '-') + substr_count($resumeText, '*');
        $avgBulletLength = $bullets > 0 ? (int)($words / $bullets) : 0;

        \Log::info('Content Analysis Results', [
            'words' => $words,
            'action_verbs_found' => $actionVerbCount,
            'action_verb_percentage' => round($actionVerbPercentage),
            'quantifiable_count' => $quantifiableCount,
            'quantifiable_percentage' => round($quantifiablePercentage)
        ]);

        return [
            'action_verbs_percentage' => round($actionVerbPercentage),
            'quantifiable_results_percentage' => round($quantifiablePercentage),
            'word_count' => $words,
            'avg_bullet_length' => $avgBulletLength,
            'reading_level' => $this->estimateReadingLevel($words, $resumeText),
        ];
    }

    /**
     * Analyze formatting
     */
    protected function analyzeFormatting($resumeText)
    {
        $issues = [];
        $issueCount = 0;

        // Check for email
        if (!preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $resumeText)) {
            $issues[] = [
                'type' => 'missing_email',
                'message' => 'Email address not found',
                'severity' => 'error'
            ];
            $issueCount++;
        }

        // Check for phone
        if (!preg_match('/\(?\d{3}\)?[-.\\s]?\d{3}[-.\\s]?\d{4}/', $resumeText)) {
            $issues[] = [
                'type' => 'missing_phone',
                'message' => 'Phone number not found',
                'severity' => 'warning'
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

        return [
            'issues' => $issueCount,
            'details' => $issues,
        ];
    }

    /**
     * More realistic score calculation
     */
    protected function calculateScoreRealistic($keywords, $formatting, $content, $hasJobDescription)
    {
        if ($hasJobDescription) {
            // With job description
            $matchPercentage = $keywords['match_percentage'] ?? 70;
            $keywordScore = ($matchPercentage / 100) * 45; // 45%
            
            $formattingScore = max(0, (1 - ($formatting['issues'] / 8)) * 100) * 20; // 20%
            
            $contentScore = (
                ($content['action_verbs_percentage'] * 0.6) +
                ($content['quantifiable_results_percentage'] * 0.4)
            ) * 25; // 25%
            
            $atsCompatibility = ($formatting['issues'] < 3 ? 100 : 60) * 10; // 10%
        } else {
            // Without job description - more conservative
            $keywordDensity = min(100, ($keywords['found'] / 20) * 100);
            $keywordScore = $keywordDensity * 0.35; // 35%
            
            $formattingScore = max(0, (1 - ($formatting['issues'] / 8)) * 100) * 25; // 25%
            
            $contentScore = (
                ($content['action_verbs_percentage'] * 0.6) +
                ($content['quantifiable_results_percentage'] * 0.4)
            ) * 25; // 25%
            
            $atsCompatibility = ($formatting['issues'] < 3 ? 100 : 60) * 15; // 15%
        }

        $totalScore = $keywordScore + $formattingScore + $contentScore + $atsCompatibility;
        
        // Cap at 95 (perfect scores are rare)
        $finalScore = min(95, round($totalScore));
        
        \Log::info('Score Calculation', [
            'keyword_score' => $keywordScore,
            'formatting_score' => $formattingScore,
            'content_score' => $contentScore,
            'ats_score' => $atsCompatibility,
            'total' => $finalScore
        ]);

        return $finalScore;
    }

    /**
     * Enhanced recommendations
     */
    protected function generateRecommendationsEnhanced($keywords, $formatting, $content, $hasJobDescription)
    {
        $recommendations = [];

        if ($hasJobDescription) {
            if (!empty($keywords['missing_critical'])) {
                $critical = implode(', ', array_slice($keywords['missing_critical'], 0, 3));
                $recommendations[] = "CRITICAL: Add these required skills: {$critical}";
            }
            
            if (!empty($keywords['missing_preferred']) && count($recommendations) < 3) {
                $preferred = implode(', ', array_slice($keywords['missing_preferred'], 0, 3));
                $recommendations[] = "Consider adding: {$preferred}";
            }
        } else {
            if ($keywords['missing'] > 0 && count($recommendations) < 3) {
                $missing = implode(', ', array_slice($keywords['missing_list'], 0, 4));
                $recommendations[] = "Add these industry-standard keywords: {$missing}";
            }
        }

        // Formatting issues
        foreach ($formatting['details'] as $issue) {
            if ($issue['severity'] === 'error' && count($recommendations) < 5) {
                $recommendations[] = "FIX: " . $issue['message'];
            }
        }

        // Content recommendations
        if ($content['action_verbs_percentage'] < 50 && count($recommendations) < 5) {
            $recommendations[] = "Use more action verbs like 'Led', 'Architected', 'Spearheaded' to start bullet points";
        }

        if ($content['quantifiable_results_percentage'] < 30 && count($recommendations) < 5) {
            $recommendations[] = "Add measurable results with numbers (e.g., 'Improved performance by 35%')";
        }

        if (empty($recommendations)) {
            $recommendations[] = "Excellent! Your resume is well-optimized for ATS systems.";
        }

        return array_slice($recommendations, 0, 5);
    }

    /**
     * Estimate reading level
     */
    protected function estimateReadingLevel($wordCount, $text)
    {
        $sentences = preg_split('/[.!?]+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        $sentenceCount = count($sentences);
        
        if ($sentenceCount == 0) return 'N/A';
        
        $avgWordsPerSentence = $wordCount / $sentenceCount;
        
        if ($avgWordsPerSentence < 15) return 'Grade 8-10';
        if ($avgWordsPerSentence < 20) return 'Grade 10-12';
        return 'Professional';
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
