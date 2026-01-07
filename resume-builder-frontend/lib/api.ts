import axios from 'axios';

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
        api.get('/detect-currency'),

    getPlans: () =>
        api.get('/pricing-plans'),
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
};

// ============================================================================
// Upload API
// ============================================================================

export const uploadAPI = {
    uploadResume: (file: File) => {
        const formData = new FormData();
        formData.append('resume', file);
        return api.post('/upload/resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    uploadJobDescription: (file: File) => {
        const formData = new FormData();
        formData.append('job_description', file);
        return api.post('/upload/job-description', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    analyzeJobDescription: (text: string) =>
        api.post('/upload/job-description', { text }),

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
