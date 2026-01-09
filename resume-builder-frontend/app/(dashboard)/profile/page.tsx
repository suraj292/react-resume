'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI, UserProfile } from '@/lib/api';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Profile form state
    const [profileData, setProfileData] = useState<Partial<UserProfile>>({
        name: '',
        email: '',
        job_title: '',
        phone: '',
        location: '',
    });
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    // Password change state
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Load user profile data
    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;

            try {
                setIsLoadingProfile(true);
                const response = await userAPI.getProfile();
                if (response.data.success) {
                    setProfileData(response.data.data);
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
                // If API fails, use data from auth context
                setProfileData({
                    name: user.name || '',
                    email: user.email || '',
                    job_title: '',
                    phone: '',
                    location: '',
                });
            } finally {
                setIsLoadingProfile(false);
            }
        };

        loadProfile();
    }, [user]);

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear any previous errors when user starts typing
        setSaveError(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const response = await userAPI.updateProfile(profileData);

            if (response.data.success) {
                setSaveSuccess(true);
                // Update will be reflected on next page load
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (error: any) {
            console.error('Failed to save profile:', error);
            setSaveError(
                error.response?.data?.message ||
                'Failed to save changes. Please try again.'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsChangingPassword(true);
        setPasswordError(null);
        setPasswordSuccess(false);

        // Client-side validation
        if (passwordData.password !== passwordData.password_confirmation) {
            setPasswordError('Passwords do not match.');
            setIsChangingPassword(false);
            return;
        }

        if (passwordData.password.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
            setIsChangingPassword(false);
            return;
        }

        try {
            const response = await userAPI.updatePassword(passwordData);

            if (response.data.success) {
                setPasswordSuccess(true);
                // Clear form
                setPasswordData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
                setTimeout(() => setPasswordSuccess(false), 5000);
            }
        } catch (error: any) {
            console.error('Failed to update password:', error);
            setPasswordError(
                error.response?.data?.message ||
                'Failed to update password. Please check your current password and try again.'
            );
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: 'fa-regular fa-user' },
        { id: 'security', label: 'Security', icon: 'fa-solid fa-shield-halved' },
        { id: 'preferences', label: 'Preferences', icon: 'fa-solid fa-sliders' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="glass-header sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-sm shadow-md group-hover:scale-105 transition-transform">
                            <i className="fa-solid fa-file-contract"></i>
                        </div>
                        <span className="text-lg font-display font-bold text-slate-800 tracking-tight">
                            Resume<span className="text-indigo-600">AI</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/builder" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Builder</Link>
                        <Link href="/ats-checker" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">ATS Checker</Link>
                        <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
                        <Link href="/profile" className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">Profile</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors"
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                                        alt="Profile"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                                        {getUserInitials()}
                                    </div>
                                )}
                                <div className="hidden md:block text-left">
                                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                                    <p className="text-[10px] text-slate-500">{user.email}</p>
                                </div>
                                <i className="fa-solid fa-chevron-down text-xs text-slate-400"></i>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <i className="fa-solid fa-user mr-2"></i>
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <i className="fa-solid fa-right-from-bracket mr-2"></i>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-6 py-10 max-w-5xl">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Profile Overview */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center animate-[slideUp_0.5s_ease-out_forwards]">
                            <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        className="w-full h-full rounded-full border-4 border-slate-50 shadow-inner object-cover"
                                        alt="Avatar"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full border-4 border-slate-50 shadow-inner bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                                        {getUserInitials()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-slate-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]">
                                    <i className="fa-solid fa-camera"></i>
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                            <p className="text-xs text-slate-500 mb-4">{user.email}</p>

                            {user.subscription_plan && user.subscription_status === 'active' ? (
                                <div className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 ${user.subscription_plan === 'premium'
                                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                                    : user.subscription_plan === 'pro'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}>
                                    {user.subscription_plan === 'premium' ? '✨ Premium Plan' :
                                        user.subscription_plan === 'pro' ? '⚡ Pro Plan' :
                                            '🆓 Free Plan'}
                                </div>
                            ) : (
                                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full mb-4">
                                    🆓 Free Plan
                                </div>
                            )}

                            <button
                                onClick={handleLogout}
                                className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <nav className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-[slideUp_0.5s_ease-out_forwards] [animation-delay:0.1s]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-5 py-3.5 text-sm font-medium flex items-center gap-3 border-l-4 transition-all ${activeTab === tab.id
                                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                                        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <i className={`${tab.icon} w-5`}></i> {tab.label}
                                </button>
                            ))}
                        </nav>

                        {/* Account Stats */}
                        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg animate-[slideUp_0.5s_ease-out_forwards] [animation-delay:0.2s]">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Account Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300">Resumes Created</span>
                                    <span className="font-bold">12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300">ATS Scans</span>
                                    <span className="font-bold">48</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-300">Member Since</span>
                                    <span className="font-bold text-xs">Oct 2023</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-9">

                        {/* Personal Info Tab */}
                        {activeTab === 'personal' && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full animate-[fadeIn_0.4s_ease-out]">
                                <div className="mb-8 border-b border-slate-100 pb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                                    <p className="text-sm text-slate-500">Update your personal details and contact information.</p>
                                </div>

                                {isLoadingProfile ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                                            <p className="text-sm text-slate-600">Loading profile...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                                        {saveError && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                                <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
                                                <div className="text-sm text-red-800">
                                                    <p className="font-bold mb-1">Error</p>
                                                    <p>{saveError}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.name || ''}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Job Title</label>
                                                <input
                                                    type="text"
                                                    value={profileData.job_title || ''}
                                                    onChange={(e) => handleInputChange('job_title', e.target.value)}
                                                    placeholder="e.g. Product Designer"
                                                    className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={profileData.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                                required
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={profileData.phone || ''}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    placeholder="+1 (555) 123-4567"
                                                    className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    value={profileData.location || ''}
                                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                                    placeholder="e.g. San Francisco, CA"
                                                    className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSaving || saveSuccess}
                                                className={`px-6 py-2.5 text-white text-sm font-bold rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center gap-2 ${saveSuccess ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-500'
                                                    }`}
                                            >
                                                {isSaving && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                                                {saveSuccess && <i className="fa-solid fa-check"></i>}
                                                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}</span>
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full animate-[fadeIn_0.4s_ease-out]">
                                <div className="mb-8 border-b border-slate-100 pb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Account Security</h2>
                                    <p className="text-sm text-slate-500">Manage your password and security settings.</p>
                                </div>

                                {/* OAuth User Info */}
                                {user.provider && (
                                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                                        <i className="fa-brands fa-google text-blue-600 text-xl mt-0.5"></i>
                                        <div className="text-sm text-blue-800">
                                            <p className="font-bold mb-1">Google Account Connected</p>
                                            <p>You're currently signed in with Google. {user.password ? 'You can update your password below.' : 'Set a password below to enable email/password login as an alternative.'}</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-xl">
                                    {passwordError && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                            <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
                                            <div className="text-sm text-red-800">
                                                <p className="font-bold mb-1">Error</p>
                                                <p>{passwordError}</p>
                                            </div>
                                        </div>
                                    )}

                                    {passwordSuccess && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                                            <i className="fa-solid fa-circle-check text-green-500 mt-0.5"></i>
                                            <div className="text-sm text-green-800">
                                                <p className="font-bold mb-1">Success</p>
                                                <p>{user.provider && !user.password ? 'Password set successfully! You can now login with your email and password.' : 'Your password has been updated successfully.'}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Only show current password field if user has a password set */}
                                    {!user.provider && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={passwordData.current_password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <i className={`fa-solid ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                                {user.provider && !user.password ? 'Set Password' : 'New Password'}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={passwordData.password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                                    placeholder="New password"
                                                    className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <i className={`fa-solid ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirm Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={passwordData.password_confirmation}
                                                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                                    placeholder="Confirm password"
                                                    className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {passwordData.password && (
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-start gap-3 mb-3">
                                                <i className="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                                                <p className="text-xs font-bold text-blue-800">Password Strength</p>
                                            </div>
                                            <div className="space-y-2 text-xs text-blue-800 ml-6">
                                                <div className="flex items-center gap-2">
                                                    <i className={`fa-solid ${passwordData.password.length >= 8 ? 'fa-check text-green-600' : 'fa-xmark text-red-600'}`}></i>
                                                    <span>Minimum 8 characters</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <i className={`fa-solid ${/[A-Z]/.test(passwordData.password) ? 'fa-check text-green-600' : 'fa-xmark text-red-600'}`}></i>
                                                    <span>At least one uppercase letter</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <i className={`fa-solid ${/[0-9!@#$%^&*]/.test(passwordData.password) ? 'fa-check text-green-600' : 'fa-xmark text-red-600'}`}></i>
                                                    <span>At least one number or symbol</span>
                                                </div>
                                                {passwordData.password_confirmation && (
                                                    <div className="flex items-center gap-2">
                                                        <i className={`fa-solid ${passwordData.password === passwordData.password_confirmation ? 'fa-check text-green-600' : 'fa-xmark text-red-600'}`}></i>
                                                        <span>Passwords match</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isChangingPassword || passwordSuccess}
                                            className={`px-6 py-2.5 text-white text-sm font-bold rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center gap-2 ${passwordSuccess ? 'bg-green-600' : 'bg-slate-900 hover:bg-slate-800'
                                                }`}
                                        >
                                            {isChangingPassword && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                                            {passwordSuccess && <i className="fa-solid fa-check"></i>}
                                            <span>
                                                {isChangingPassword
                                                    ? (user.provider && !user.password ? 'Setting Password...' : 'Updating...')
                                                    : passwordSuccess
                                                        ? (user.provider && !user.password ? 'Password Set!' : 'Updated!')
                                                        : (user.provider && !user.password ? 'Set Password' : 'Update Password')
                                                }
                                            </span>
                                        </button>
                                    </div>
                                </form>

                                {/* Danger Zone */}
                                <div className="mt-12 pt-8 border-t border-slate-100">
                                    <h3 className="text-red-600 font-bold mb-4">Danger Zone</h3>
                                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Delete Account</h4>
                                            <p className="text-xs text-slate-500">Permanently remove your account and all data.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full animate-[fadeIn_0.4s_ease-out]">
                                <div className="mb-8 border-b border-slate-100 pb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Preferences</h2>
                                    <p className="text-sm text-slate-500">Customize your experience and notification settings.</p>
                                </div>

                                <div className="space-y-8">
                                    {/* Notifications */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Email Notifications</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">Job Alerts</p>
                                                    <p className="text-xs text-slate-500">Get notified when new jobs match your resume.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">Product Updates</p>
                                                    <p className="text-xs text-slate-500">Receive news about new features and templates.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 w-full"></div>

                                    {/* Resume Defaults */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Resume Defaults</h3>
                                        <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Default Narrative Tone</label>
                                                <select className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500">
                                                    <option>Professional</option>
                                                    <option>Confident</option>
                                                    <option>Technical</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date Format</label>
                                                <select className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500">
                                                    <option>MM/YYYY</option>
                                                    <option>Month Year</option>
                                                    <option>YYYY-MM-DD</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-colors">
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Subscription Tab */}
                        {activeTab === 'subscription' && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full animate-[fadeIn_0.4s_ease-out]">
                                <div className="mb-8 border-b border-slate-100 pb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Subscription & Billing</h2>
                                    <p className="text-sm text-slate-500">Manage your plan and payment methods.</p>
                                </div>

                                {/* Current Plan */}
                                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col md:flex-row items-center justify-between mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-indigo-900">Pro Plan</h3>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">Active</span>
                                        </div>
                                        <p className="text-sm text-indigo-700 mb-1">
                                            Your next billing date is <span className="font-bold">Nov 24, 2023</span>
                                        </p>
                                        <p className="text-xs text-indigo-500">Visa ending in •••• 4242</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex gap-3">
                                        <button className="px-4 py-2 bg-white text-indigo-600 text-xs font-bold rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
                                            Manage Billing
                                        </button>
                                        <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-indigo-500 transition-colors">
                                            Upgrade Plan
                                        </button>
                                    </div>
                                </div>

                                {/* Billing History */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-4">Billing History</h4>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">Date</th>
                                                    <th className="px-6 py-3 font-medium">Amount</th>
                                                    <th className="px-6 py-3 font-medium">Status</th>
                                                    <th className="px-6 py-3 font-medium text-right">Invoice</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-slate-700">Oct 24, 2023</td>
                                                    <td className="px-6 py-4 text-slate-700">$19.00</td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">Paid</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <a href="#" className="text-indigo-600 hover:underline">Download</a>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-slate-700">Sep 24, 2023</td>
                                                    <td className="px-6 py-4 text-slate-700">$19.00</td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">Paid</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <a href="#" className="text-indigo-600 hover:underline">Download</a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800 text-sm mt-auto">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2023 ResumeBP. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
