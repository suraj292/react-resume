'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    avatar: string | null;
    provider: string | null;
    password?: string | null;
    subscription_plan?: 'free' | 'pro' | 'premium' | null;
    subscription_status?: 'active' | 'inactive' | 'cancelled' | 'expired' | null;
    created_at?: string;
    updated_at?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
    logout: () => Promise<void>;
    setAuthData: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load auth data from localStorage on mount
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setLoading(false);
        } else if (savedToken) {
            // Token exists but no user data - fetch from API
            setToken(savedToken);
            authAPI.me()
                .then((response) => {
                    const userData = response.data.user;
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                })
                .catch((error) => {
                    console.error('Failed to fetch user:', error);
                    // Clear invalid token
                    localStorage.removeItem('auth_token');
                    setToken(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const setAuthData = (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const login = async (email: string, password: string) => {
        const response = await authAPI.login({ email, password });
        const { user: userData, token: authToken } = response.data;
        setAuthData(userData, authToken);
    };

    const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
        const response = await authAPI.register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });
        const { user: userData, token: authToken } = response.data;
        setAuthData(userData, authToken);
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, setAuthData }}>
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
