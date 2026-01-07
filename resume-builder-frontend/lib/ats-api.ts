import api from './api';

interface ATSAnalysisRequest {
    resume_text: string;
    job_description?: string;
}

interface ATSAnalysisResponse {
    score: number;
    rating: string;
    keywords: {
        found: number;
        missing: number;
        found_list: string[];
        missing_list: string[];
    };
    formatting: {
        issues: number;
        details: {
            type: string;
            message: string;
            severity: 'error' | 'warning' | 'info';
        }[];
    };
    content: {
        action_verbs_percentage: number;
        quantifiable_results_percentage: number;
        word_count: number;
        avg_bullet_length: number;
        reading_level: string;
    };
    recommendations: string[];
}

export async function analyzeResume(
    resumeText: string,
    jobDescription?: string
): Promise<ATSAnalysisResponse> {
    const response = await api.post('/ats/analyze', {
        resume_text: resumeText,
        job_description: jobDescription,
    });

    return response.data;
}
