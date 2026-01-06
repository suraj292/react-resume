'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Header from '@/components/layout/header';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [gstNumber, setGstNumber] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Price calculations
    const basePrice = 499.00;
    const gstRate = 0.18;
    const gstAmount = basePrice * gstRate;
    const subtotal = basePrice + gstAmount;
    const discountAmount = couponApplied ? basePrice * 0.20 : 0;
    const totalPrice = subtotal - discountAmount;

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [user, loading, router]);

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const applyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        setCouponError('');

        if (!code) return;

        if (code === 'SAVE20') {
            setCouponApplied(true);
            setCouponError('');
        } else {
            setCouponApplied(false);
            setCouponError('Invalid coupon code. Please try again.');
        }
    };

    const handlePayment = () => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            alert(`Payment Successful!\n\nAmount: ₹${totalPrice.toFixed(2)}\n\nRedirecting to Resume Builder...`);
            router.push('/builder');
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <Header />

            {/* SSL Badge Bar */}
            <div className="bg-green-50 border-b border-green-100 py-2">
                <div className="container mx-auto px-6 flex items-center justify-center gap-2 text-green-700 text-xs font-bold">
                    <i className="fa-solid fa-lock"></i>
                    <span>SSL Secure Checkout - Your information is encrypted and safe</span>
                </div>
            </div>

            <main className="flex-grow container mx-auto px-6 py-12 max-w-6xl">
                {/* Hero Title */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Complete Your Purchase</h1>
                    <p className="text-slate-500">Unlock premium features and land your dream job faster.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* LEFT COLUMN: Payment Details */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Plan Details */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                                SELECTED
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                                        Pro Plan <span className="text-slate-400 font-normal mx-2">|</span> Monthly
                                    </h3>
                                    <p className="text-sm text-slate-500">Unlimited resumes, AI optimization, PDF downloads</p>
                                </div>
                                <Link href="/pricing" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                                    Change Plan
                                </Link>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</span>
                                Billing Information
                            </h3>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={user.name}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none bg-slate-50"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none bg-slate-50"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                        GST Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter GST Number for business invoice"
                                        value={gstNumber}
                                        onChange={(e) => setGstNumber(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 placeholder-slate-400 transition-all"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</span>
                                Payment Method
                            </h3>

                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
                                <div className="flex justify-center items-center gap-4 mb-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                                    <i className="fa-brands fa-google-pay text-2xl"></i>
                                    <i className="fa-brands fa-cc-visa text-2xl"></i>
                                    <i className="fa-brands fa-cc-mastercard text-2xl"></i>
                                    <i className="fa-solid fa-building-columns text-xl"></i>
                                </div>
                                <h4 className="font-bold text-indigo-900 mb-1">Pay Securely with Razorpay</h4>
                                <p className="text-xs text-indigo-600 mb-4">Supports UPI, Credit/Debit Cards, Net Banking, and Wallets</p>

                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 mx-auto disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <i className="fa-solid fa-circle-notch fa-spin"></i> Processing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-lock text-xs"></i> Proceed to Pay
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-center text-[10px] text-slate-400 mt-4">
                                <i className="fa-solid fa-shield-halved text-green-500 mr-1"></i>
                                Your payment information is encrypted and secure.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
                            <h3 className="font-bold text-slate-900 text-lg mb-6 border-b border-slate-100 pb-4">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Pro Plan (Monthly)</span>
                                    <span className="font-medium text-slate-900">₹{basePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>GST (18%)</span>
                                    <span className="font-medium text-slate-900">₹{gstAmount.toFixed(2)}</span>
                                </div>

                                {/* Discount Row */}
                                {couponApplied && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold animate-fade-in">
                                        <span>Coupon Discount (20%)</span>
                                        <span>-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Have a coupon code?"
                                        value={couponCode}
                                        onChange={(e) => {
                                            setCouponCode(e.target.value.toUpperCase());
                                            setCouponError('');
                                        }}
                                        className={`w-full pl-4 pr-24 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-4 uppercase transition-all ${couponApplied
                                            ? 'border-green-500 focus:ring-green-100'
                                            : couponError
                                                ? 'border-red-500 focus:ring-red-100'
                                                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                                            }`}
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponApplied && (
                                    <p className="text-xs mt-2 text-green-600 font-bold">
                                        Coupon applied successfully! You saved ₹{discountAmount.toFixed(2)}
                                    </p>
                                )}
                                {couponError && (
                                    <p className="text-xs mt-2 text-red-500">{couponError}</p>
                                )}
                            </div>

                            <div className="border-t border-slate-100 pt-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-500 font-medium">Total Payable</span>
                                    <div className="text-right">
                                        <span className={`block text-3xl font-display font-bold transition-all duration-300 ${couponApplied ? 'text-green-600' : 'text-slate-900'}`}>
                                            ₹{totalPrice.toFixed(2)}
                                        </span>
                                        <span className="text-[10px] text-slate-400">Includes all taxes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <i className="fa-solid fa-award text-indigo-500"></i>
                                    <div className="text-[10px] leading-tight text-slate-600">
                                        <span className="font-bold block text-slate-800">Money Back</span>
                                        7-day guarantee
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <i className="fa-solid fa-headset text-indigo-500"></i>
                                    <div className="text-[10px] leading-tight text-slate-600">
                                        <span className="font-bold block text-slate-800">Support</span>
                                        24/7 Assistance
                                    </div>
                                </div>
                            </div>

                            {/* Footer Note */}
                            <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed">
                                By proceeding, you agree to our{' '}
                                <Link href="/terms" className="underline hover:text-slate-600">Terms of Service</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
                                Subscriptions auto-renew but can be cancelled anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800 text-sm mt-auto">
                <div className="container mx-auto px-6 text-center flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; 2024 ResumeAI. All rights reserved.</p>
                    <div className="flex gap-4 text-xl opacity-50">
                        <i className="fa-brands fa-cc-visa"></i>
                        <i className="fa-brands fa-cc-mastercard"></i>
                        <i className="fa-brands fa-cc-amex"></i>
                        <i className="fa-solid fa-building-columns"></i>
                    </div>
                </div>
            </footer>
        </div>
    );
}
