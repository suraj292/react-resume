import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subscription {
    status: 'active' | 'inactive' | 'cancelled';
    plan_type: 'free' | 'premium' | 'pro';
    plan_id?: number;
    expires_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    subscription?: Subscription;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            setToken: (token) => set({ token }),

            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
