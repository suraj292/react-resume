import { analyzeResume } from './ats-api';

interface ATSCacheData {
    resumeText: string;
    analysisResult: any;
    timestamp: number;
    userId?: string;
}

const CACHE_KEY = 'ats-analysis-cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * ATS Analysis Cache Service
 * Stores ATS analysis results for reuse across the application
 */
export const atsCache = {
    /**
     * Analyze resume in background and cache the result
     */
    async analyzeAndCache(resumeText: string, jobDescription?: string): Promise<any> {
        try {
            const result = await analyzeResume(resumeText, jobDescription);

            const cacheData: ATSCacheData = {
                resumeText,
                analysisResult: result,
                timestamp: Date.now(),
            };

            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

            return result;
        } catch (error) {
            console.error('ATS analysis failed:', error);
            throw error;
        }
    },

    /**
     * Get cached analysis result
     */
    getCached(): ATSCacheData | null {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const data: ATSCacheData = JSON.parse(cached);

            // Check if cache is still valid (24 hours)
            if (Date.now() - data.timestamp > CACHE_DURATION) {
                this.clearCache();
                return null;
            }

            return data;
        } catch (error) {
            console.error('Failed to get cached ATS data:', error);
            return null;
        }
    },

    /**
     * Get cached analysis result
     */
    getCachedAnalysis(): any | null {
        const cached = this.getCached();
        return cached?.analysisResult || null;
    },

    /**
     * Check if we have a valid cached analysis
     */
    hasCached(): boolean {
        return this.getCached() !== null;
    },

    /**
     * Clear cached analysis
     */
    clearCache(): void {
        localStorage.removeItem(CACHE_KEY);
    },

    /**
     * Update cache with new analysis
     */
    updateCache(resumeText: string, analysisResult: any): void {
        const cacheData: ATSCacheData = {
            resumeText,
            analysisResult,
            timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    },

    /**
     * Get recommendations from cached analysis
     */
    getCachedRecommendations(): string[] {
        const cached = this.getCachedAnalysis();
        return cached?.recommendations || [];
    },

    /**
     * Get missing keywords from cached analysis
     */
    getCachedMissingKeywords(): string[] {
        const cached = this.getCachedAnalysis();
        return cached?.keywords?.missing_list || [];
    },

    /**
     * Get ATS score from cached analysis
     */
    getCachedScore(): number | null {
        const cached = this.getCachedAnalysis();
        return cached?.score || null;
    },

    /**
     * Analyze in background (non-blocking)
     */
    analyzeInBackground(resumeText: string, jobDescription?: string): void {
        // Fire and forget - don't await
        this.analyzeAndCache(resumeText, jobDescription).catch(err => {
            console.error('Background ATS analysis failed:', err);
        });
    }
};
