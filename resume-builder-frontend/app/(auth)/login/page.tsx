'use client';

import Link from 'next/link';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { socialAuthURL } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, register, setAuthData } = useAuth();

    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form data states
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupPasswordConfirmation, setSignupPasswordConfirmation] = useState('');

    useEffect(() => {
        // Check for OAuth callback token
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('auth_token', token);
            // Fetch user data and redirect
            router.push('/builder');
        }

        // Check for email verification status
        const verified = searchParams.get('verified');
        if (verified === 'success') {
            setSuccessMessage('Email verified successfully! You can now log in.');
        } else if (verified === 'already') {
            setSuccessMessage('Email already verified. You can log in.');
        }

        // Check for OAuth errors
        const errorParam = searchParams.get('error');
        const errorMessage = searchParams.get('message');
        const provider = searchParams.get('provider');

        if (errorParam === 'oauth_failed') {
            const providerName = provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'provider';
            setError(`Failed to authenticate with ${providerName}. Please try again.`);
        } else if (errorParam === 'no_email') {
            const providerName = provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'provider';
            setError(`Unable to get email from ${providerName}. Please make sure your email is public or use a different login method.`);
        } else if (errorParam === 'auth_failed') {
            setError('Authentication failed. Please try again.');
        } else if (errorParam === 'no_token') {
            setError('No authentication token received. Please try again.');
        }
    }, [searchParams, router]);

    const togglePassword = () => setShowPassword(!showPassword);

    const calculatePasswordStrength = (pwd: string): number => {
        let strength = 0;
        if (pwd.length > 5) strength++;
        if (pwd.length > 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        return strength;
    };

    const getStrengthColor = (strength: number): string => {
        const colors = ['bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
        return colors[Math.max(0, strength - 1)] || 'bg-slate-200';
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(loginEmail, loginPassword);
            router.push('/builder');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (signupPassword !== signupPasswordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await register(signupName, signupEmail, signupPassword, signupPasswordConfirmation);
            setSuccessMessage('Registration successful! Please check your email to verify your account.');
            setActiveTab('login');
        } catch (err: any) {
            const errorData = err.response?.data;
            if (errorData?.errors) {
                // Laravel validation errors
                const firstError = Object.values(errorData.errors)[0] as string[];
                setError(firstError[0]);
            } else {
                setError(errorData?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: 'google' | 'linkedin' | 'github') => {
        const url = socialAuthURL[provider]();
        window.location.href = url;
    };


    const passwordStrength = calculatePasswordStrength(signupPassword);
    const strengthColor = getStrengthColor(passwordStrength);


    return (
        <div className="min-h-screen flex items-center justify-center p-4 text-slate-900 bg-slate-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            {/* Main Card */}
            <main className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-slide-up">

                {/* LEFT: Branding Section */}
                <div className="md:w-5/12 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative overlay */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float"></div>
                    <div className="absolute bottom-[-20px] left-[-20px] w-60 h-60 bg-indigo-500/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-2 mb-8 group w-max">
                            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-sm border border-white/20 group-hover:scale-105 transition-transform">
                                <i className="fa-solid fa-layer-group"></i>
                            </div>
                            <span className="font-bold text-lg tracking-tight">Resume<span className="text-indigo-200">BP</span></span>
                        </Link>

                        <h1 className="text-3xl font-display font-bold mb-4 leading-tight">Build Smarter Resumes with AI</h1>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-6">Create ATS-friendly resumes in minutes and land 3x more interviews with our intelligent optimization engine.</p>

                        {/* Mini Testimonial */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-auto">
                            <div className="flex text-yellow-400 text-xs mb-2">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <p className="text-xs italic text-indigo-50 mb-2">&quot;This tool completely transformed my job search. I got hired at my dream company within 2 weeks!&quot;</p>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center text-[10px] font-bold">JD</div>
                                <span className="text-xs font-bold">John D., Software Engineer</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links (Desktop) */}
                    <div className="relative z-10 mt-8 hidden md:flex gap-4 text-xs text-indigo-200">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>

                {/* RIGHT: Auth Forms */}
                <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="max-w-xs mx-auto w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <i className="fa-solid fa-circle-exclamation mr-2"></i>
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="max-w-xs mx-auto w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            <i className="fa-solid fa-circle-check mr-2"></i>
                            {successMessage}
                        </div>
                    )}

                    {/* Tab Switcher */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-8 w-full max-w-xs mx-auto">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'login'
                                ? 'bg-white shadow-sm text-slate-800'
                                : 'text-slate-500 font-medium hover:text-slate-700'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`flex-1 py-2 rounded-lg text-sm transition-all ${activeTab === 'signup'
                                ? 'bg-white shadow-sm text-slate-800 font-bold'
                                : 'text-slate-500 font-medium hover:text-slate-700'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* LOGIN FORM */}
                    {activeTab === 'login' && (
                        <div className="max-w-xs mx-auto w-full animate-fade-in">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                                <p className="text-sm text-slate-500">Enter your details to access your account</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="input-group relative">
                                    <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-[0.95rem]"
                                        required
                                    />
                                </div>

                                <div className="input-group relative">
                                    <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-[0.95rem]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                    >
                                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                        Remember me
                                    </label>
                                    <Link href="#" className="text-indigo-600 font-semibold hover:underline">Forgot Password?</Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                                            <span>Logging in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Login</span>
                                            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* SIGN UP FORM */}
                    {activeTab === 'signup' && (
                        <div className="max-w-xs mx-auto w-full animate-fade-in">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                                <p className="text-sm text-slate-500">Get started with your free resume builder</p>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="input-group relative">
                                    <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={signupName}
                                        onChange={(e) => setSignupName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-[0.95rem]"
                                        required
                                    />
                                </div>

                                <div className="input-group relative">
                                    <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-[0.95rem]"
                                        required
                                    />
                                </div>

                                <div className="input-group relative">
                                    <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-[0.95rem]"
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                    >
                                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>

                                {/* Password Confirmation */}
                                <div className="input-group relative">
                                    <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Confirm Password"
                                        className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-[0.95rem]"
                                        value={signupPasswordConfirmation}
                                        onChange={(e) => setSignupPasswordConfirmation(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                    >
                                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>

                                {/* Password Strength */}
                                <div className={`flex gap-1 h-1 mt-1 transition-opacity ${signupPassword.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                                    {[0, 1, 2, 3].map((index) => (
                                        <div
                                            key={index}
                                            className={`flex-1 rounded-full transition-colors duration-300 ${index < passwordStrength ? strengthColor : 'bg-slate-200'
                                                }`}
                                        ></div>
                                    ))}
                                </div>

                                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 mt-2">
                                    <input type="checkbox" required className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5" />
                                    <span>I agree to the <Link href="#" className="text-indigo-600 hover:underline">Terms of Service</Link> & <Link href="#" className="text-indigo-600 hover:underline">Privacy Policy</Link></span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <i className="fa-solid fa-user-plus group-hover:scale-110 transition-transform"></i>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Social Login */}
                    <div className="max-w-xs mx-auto w-full mt-8">
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                            <span className="relative bg-white px-3 text-xs text-slate-500 font-medium">Or continue with</span>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-200 hover:bg-slate-50 transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <i className="fa-brands fa-google text-lg"></i>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('linkedin')}
                                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-200 hover:bg-slate-50 transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <i className="fa-brands fa-linkedin-in text-lg text-blue-700"></i>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('github')}
                                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-200 hover:bg-slate-50 transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <i className="fa-brands fa-github text-lg"></i>
                            </button>
                        </div>

                        <div className="mt-8 text-center flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            <i className="fa-solid fa-lock text-green-500"></i> Secure SSL Encrypted
                        </div>
                    </div>

                    {/* Footer Links (Mobile Only) */}
                    <div className="md:hidden mt-8 text-center text-xs text-slate-400 flex justify-center gap-4">
                        <Link href="#">Privacy</Link>
                        <Link href="#">Terms</Link>
                        <Link href="#">Help</Link>
                    </div>

                </div>
            </main>

            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                
                @keyframes slideUp {
                    0% { transform: translateY(10px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
