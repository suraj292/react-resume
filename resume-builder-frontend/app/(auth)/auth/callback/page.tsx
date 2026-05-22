'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Set auth cookie for middleware (same as AuthContext.tsx)
function setAuthCookie(value: string, days = 30) {
    const expires = new Date(Date.now() + days * 86400_000).toUTCString();
    document.cookie = `auth_present=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Store the token
            localStorage.setItem('auth_token', token);
            
            // Set auth cookie so middleware allows access to protected routes
            setAuthCookie('1');

            // Fetch user data and store it (same as regular login)
            api.get('/auth/me')
                .then((response) => {
                    const userData = response.data.user;
                    localStorage.setItem('user', JSON.stringify(userData));
                    // Redirect to builder
                    router.push('/builder');
                })
                .catch(() => {
                    // If fetch fails, still redirect but user data will be fetched on builder page
                    router.push('/builder');
                });
        } else {
            router.push('/login?error=no_token');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-slate-600">Completing authentication...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
