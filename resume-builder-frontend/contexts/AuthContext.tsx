'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { authAPI } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlanSummary {
    slug: string;
    name: string;
}

interface SubscriptionSummary {
    plan_slug: string;
    period: 'monthly' | 'yearly';
    status: 'active' | 'expired' | 'cancelled';
    valid_from: string | null;
    valid_until: string | null;
    is_active: boolean;
}

interface PlanLimits {
    plan_name: string;
    plan_slug: string;
    resumes: { limit: number | 'unlimited'; used: number; remaining: number | 'unlimited' };
    downloads: { limit: number | 'unlimited'; used: number; remaining: number | 'unlimited' };
    ai_requests: { limit: number | 'unlimited'; used: number; remaining: number | 'unlimited' };
    can_export_pdf: boolean;
    can_export_docx: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    avatar: string | null;
    provider: string | null;
    job_title?: string | null;
    phone?: string | null;
    location?: string | null;
    currency_preference: string;
    created_at?: string;
    // Plan & subscription (always present from /me, login, register)
    plan: PlanSummary;
    subscription: SubscriptionSummary | null;
    limits: PlanLimits;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
    logout: () => Promise<void>;
    setAuthData: (user: User, token: string) => void;
    refreshUser: () => Promise<void>;
}

// ── Cookie helper (non-httpOnly, middleware-visible) ──────────────────────────

function setAuthCookie(value: string, days = 30) {
    const expires = new Date(Date.now() + days * 86400_000).toUTCString();
    document.cookie = `auth_present=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

function clearAuthCookie() {
    document.cookie = 'auth_present=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser]       = useState<User | null>(null);
    const [token, setToken]     = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Internal helper — updates all state + localStorage + cookie atomically
    const applyAuthData = useCallback((userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthCookie('1');
    }, []);

    const clearAuthData = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        clearAuthCookie();
    }, []);

    // Fetch fresh user data from /api/auth/me
    const refreshUser = useCallback(async () => {
        try {
            const response = await authAPI.me();
            const freshUser: User = response.data.user;
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
        } catch {
            // Token may have expired — clear session
            clearAuthData();
        }
    }, [clearAuthData]);

    // Bootstrap from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser  = localStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                const parsedUser: User = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
                setAuthCookie('1');
                setLoading(false);

                // Refresh in the background to pick up plan/subscription changes
                authAPI.me()
                    .then((res) => {
                        const fresh: User = res.data.user;
                        setUser(fresh);
                        localStorage.setItem('user', JSON.stringify(fresh));
                    })
                    .catch(() => {
                        // Token expired; clear silently
                        clearAuthData();
                    });
            } catch {
                clearAuthData();
                setLoading(false);
            }
        } else if (savedToken) {
            setToken(savedToken);
            authAPI.me()
                .then((res) => {
                    const fresh: User = res.data.user;
                    applyAuthData(fresh, savedToken);
                })
                .catch(() => clearAuthData())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const setAuthData = useCallback((userData: User, authToken: string) => {
        applyAuthData(userData, authToken);
    }, [applyAuthData]);

    const login = async (email: string, password: string) => {
        const response = await authAPI.login({ email, password });
        const { user: userData, token: authToken } = response.data;
        applyAuthData(userData, authToken);
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        passwordConfirmation: string
    ) => {
        const response = await authAPI.register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });
        const { user: userData, token: authToken } = response.data;
        applyAuthData(userData, authToken);
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch {
            // Ignore errors
        } finally {
            clearAuthData();
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, register, logout, setAuthData, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
