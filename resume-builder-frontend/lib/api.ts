import axios from 'axios';
import { cachedAPICall, CACHE_DURATION } from './api-cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// ============================================================================
// Auth API
// ============================================================================

export const authAPI = {
    register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
        api.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),

    logout: () =>
        api.post('/auth/logout'),

    me: () =>
        api.get('/auth/me'),

    resendVerificationEmail: () =>
        api.post('/auth/email/resend'),
};

// ============================================================================
// Pricing API
// ============================================================================

export const pricingAPI = {
    detectCurrency: () =>
        cachedAPICall(
            'pricing:currency',
            () => api.get('/detect-currency'),
            CACHE_DURATION.VERY_LONG // 24 hours
        ),

    getPlans: () =>
        cachedAPICall(
            'pricing:plans',
            () => api.get('/pricing-plans'),
            CACHE_DURATION.LONG // 30 minutes
        ),
};

// ============================================================================
// Contact API
// ============================================================================

export const contactAPI = {
    getSettings: () =>
        api.get('/contact/settings'),

    submitEnquiry: (data: { name: string; email: string; subject: string; message: string }) =>
        api.post('/contact/enquiry', data),
};

// ============================================================================
// Resume API
// ============================================================================

export const resumeAPI = {
    getAll: () =>
        api.get('/resumes'),

    getOne: (id: string | number) =>
        api.get(`/resumes/${id}`),

    create: (data: any) =>
        api.post('/resumes', data),

    update: (id: string | number, data: any, config?: any) =>
        api.put(`/resumes/${id}`, data, config),

    delete: (id: string | number) =>
        api.delete(`/resumes/${id}`),

    restore: (id: string | number) =>
        api.post(`/resumes/${id}/restore`),
};

// ============================================================================
// Upload API
// ============================================================================

export const uploadAPI = {
    uploadResume: (file: File) => {
        const formData = new FormData();
        formData.append('file', file); // Changed from 'resume' to 'file'
        return api.post('/uploads/resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    uploadJobDescription: (file: File) => {
        const formData = new FormData();
        formData.append('job_description', file);
        return api.post('/uploads/job-description', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    analyzeJobDescription: (text: string) =>
        api.post('/uploads/job-description', { text }),

    getUploadStatus: (uploadId: string) =>
        api.get(`/uploads/${uploadId}/status`),
};

// ============================================================================
// ATS API
// ============================================================================

export const atsAPI = {
    analyzeResume: (resumeText: string) =>
        api.post('/ats/analyze', { resume_text: resumeText }),
};

// ============================================================================
// PDF Export API
// ============================================================================

export const pdfAPI = {
    export: (resumeData: any) =>
        api.post('/export/pdf', resumeData, {
            responseType: 'blob',
        }),
};

// ============================================================================
// Coupon API
// ============================================================================

export const couponAPI = {
    validate: (code: string, amount?: number) =>
        api.post('/coupons/validate', { code, amount }),

    apply: (code: string, planId: number) =>
        api.post('/coupons/apply', { code, plan_id: planId }),
};

// ============================================================================
// Payment API
// ============================================================================

export const paymentAPI = {
    createOrder: (data: any) =>
        api.post('/payments/create-order', data),

    verifyPayment: (data: any) =>
        api.post('/payments/verify', data),
};

export const blogAPI = {
    getAll: (params?: any) =>
        cachedAPICall(
            `blog:posts:${JSON.stringify(params || {})}`,
            () => api.get('/blog/posts', { params }),
            CACHE_DURATION.MEDIUM // 5 minutes
        ),

    getBySlug: (slug: string) =>
        cachedAPICall(
            `blog:post:${slug}`,
            () => api.get(`/blog/posts/${slug}`),
            CACHE_DURATION.LONG // 30 minutes
        ),

    getCategories: () =>
        cachedAPICall(
            'blog:categories',
            () => api.get('/blog/categories'),
            CACHE_DURATION.VERY_LONG // 24 hours
        ),
};

// ============================================================================
// User Profile API
// ============================================================================

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    job_title?: string;
    phone?: string;
    location?: string;
    avatar?: string;
}

export const userAPI = {
    /**
     * Get current user's profile
     */
    getProfile: () =>
        api.get<{ success: boolean; data: UserProfile }>('/user/profile'),

    /**
     * Update current user's profile
     */
    updateProfile: (data: Partial<UserProfile>) =>
        api.put<{ success: boolean; data: UserProfile }>('/user/profile', data),

    /**
     * Update user avatar
     */
    updateAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return api.post<{ success: boolean; data: { avatar: string } }>('/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Update user password
     */
    updatePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
        api.put<{ success: boolean; message: string }>('/user/password', data),
};

// ============================================================================
// SEO API
// ============================================================================

export interface PageSeoData {
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    og_type: string | null;
    og_url: string | null;
    twitter_card: string | null;
    twitter_title: string | null;
    twitter_description: string | null;
    twitter_image: string | null;
    twitter_site: string | null;
    twitter_creator: string | null;
    canonical_url: string | null;
    robots: string | null;
    language: string | null;
    alternate_languages: Record<string, string> | null;
    schema_markup: any | null;
}

export const seoAPI = {
    /**
     * Get SEO data for a specific route
     */
    getForRoute: (route: string) => {
        const encodedRoute = route === '/' ? '%2F' : route.replace(/^\//, '');
        return cachedAPICall(
            `seo:route:${route}`,
            () => api.get<{ success: boolean; data: PageSeoData }>(`/seo/${encodedRoute}`),
            CACHE_DURATION.VERY_LONG // 24 hours - SEO data rarely changes
        );
    },

    /**
     * Get all published pages with SEO data
     */
    getAllPages: () =>
        cachedAPICall(
            'seo:all-pages',
            () => api.get<{ success: boolean; data: Array<{ page_route: string; page_name: string; meta_title: string; meta_description: string }> }>('/seo'),
            CACHE_DURATION.VERY_LONG // 24 hours
        ),
};

// ============================================================================
// Template API
// ============================================================================

export interface TemplateData {
    id: string;
    name: string;
    category: string;
    description: string;
    preview_image: string | null;
    thumbnail_image: string | null;
    supported_colors: string[];
    features: string[];
    is_premium: boolean;
    best_for: string;
    complexity_level: 'beginner' | 'intermediate' | 'advanced';
}

export const templateAPI = {
    /**
     * Get all active templates
     */
    getAll: (params?: { premium?: boolean; complexity?: string }) =>
        cachedAPICall(
            `templates:all:${JSON.stringify(params || {})}`,
            () => api.get<{ success: boolean; data: TemplateData[] }>('/templates', { params }),
            CACHE_DURATION.LONG // 30 minutes
        ),

    /**
     * Get a specific template by ID
     */
    getById: (templateId: string) =>
        cachedAPICall(
            `templates:${templateId}`,
            () => api.get<{ success: boolean; data: TemplateData }>(`/templates/${templateId}`),
            CACHE_DURATION.LONG // 30 minutes
        ),

    /**
     * Get all template categories
     */
    getCategories: () =>
        cachedAPICall(
            'templates:categories',
            () => api.get<{ success: boolean; data: string[] }>('/templates/categories'),
            CACHE_DURATION.VERY_LONG // 24 hours - categories rarely change
        ),

    /**
     * Track template selection (analytics)
     * Note: Analytics calls are NOT cached
     */
    trackSelection: (templateId: string) =>
        api.post('/templates/analytics/select', { template_id: templateId }),

    /**
     * Track template preview view
     * Note: Analytics calls are NOT cached
     */
    trackPreview: (templateId: string) =>
        api.post('/templates/analytics/preview', { template_id: templateId }),
};

// ============================================================================
// Social Auth URLs
// ============================================================================

export const socialAuthURL = {
    google: () => `${API_URL}/auth/google`,
    linkedin: () => `${API_URL}/auth/linkedin`,
    github: () => `${API_URL}/auth/github`,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
};

/**
 * Set auth token in localStorage
 */
export const setAuthToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};
