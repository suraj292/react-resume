'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('personal');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSaving(false);
        setSaveSuccess(true);

        setTimeout(() => setSaveSuccess(false), 2000);
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: 'fa-regular fa-user' },
        { id: 'security', label: 'Security', icon: 'fa-solid fa-shield-halved' },
        { id: 'preferences', label: 'Preferences', icon: 'fa-solid fa-sliders' },
        { id: 'subscription', label: 'Subscription', icon: 'fa-regular fa-credit-card' },
    ];

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
                        <Link href="/builder" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link>
                        <Link href="/builder" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Builder</Link>
                        <Link href="/ats-checker" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">ATS Check</Link>
                        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Templates</Link>
                        <Link href="/profile" className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">Profile</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-bold text-slate-900">Alex Morgan</p>
                            <p className="text-[10px] text-slate-500">Pro Member</p>
                        </div>
                        <div className="relative group cursor-pointer">
                            <img
                                src="https://ui-avatars.com/api/?name=Alex+Morgan&background=6366f1&color=fff"
                                className="w-9 h-9 rounded-full border-2 border-white shadow-sm hover:border-indigo-200 transition-all"
                                alt="Profile"
                            />
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
                                <img
                                    src="https://ui-avatars.com/api/?name=Alex+Morgan&background=6366f1&color=fff&size=128"
                                    className="w-full h-full rounded-full border-4 border-slate-50 shadow-inner"
                                    alt="Avatar"
                                />
                                <div className="absolute inset-0 bg-slate-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]">
                                    <i className="fa-solid fa-camera"></i>
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Alex Morgan</h2>
                            <p className="text-xs text-slate-500 mb-4">alex.morgan@example.com</p>

                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-4">Pro Plan</div>

                            <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                Upgrade to Premium
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

                                <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Alex Morgan"
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Job Title</label>
                                            <input
                                                type="text"
                                                defaultValue="Product Designer"
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue="alex.morgan@example.com"
                                            className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                defaultValue="+1 (555) 123-4567"
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
                                            <input
                                                type="text"
                                                defaultValue="San Francisco, CA"
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
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full animate-[fadeIn_0.4s_ease-out]">
                                <div className="mb-8 border-b border-slate-100 pb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Account Security</h2>
                                    <p className="text-sm text-slate-500">Manage your password and security settings.</p>
                                </div>

                                <form onSubmit={handleSave} className="space-y-6 max-w-xl">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Password</label>
                                            <input
                                                type="password"
                                                placeholder="New password"
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirm Password</label>
                                            <input
                                                type="password"
                                                placeholder="Confirm password"
                                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                                        <i className="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                                        <div className="text-xs text-blue-800">
                                            <p className="font-bold mb-1">Password Requirements</p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>Minimum 8 characters long</li>
                                                <li>At least one uppercase character</li>
                                                <li>At least one number or symbol</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-between">
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all transform active:scale-95"
                                        >
                                            Update Password
                                        </button>
                                        <span className="text-xs text-slate-400">Last updated: 3 months ago</span>
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
                                        <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors">
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
                    <p>&copy; 2023 ResumeAI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
