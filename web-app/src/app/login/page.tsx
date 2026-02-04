'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function AuthPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        // Redirect if already logged in
        if (user) {
            router.push('/dashboard');
            return;
        }

        // Check if redirected from registration
        if (searchParams.get('registered') === 'true') {
            setShowSuccess(true);
            setIsLogin(true); // Show login tab
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [searchParams, user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await login(formData.email, formData.password);
        } catch (error: any) {
            setErrors({ submit: error.message || 'Login failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        AI Retail System
                    </h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Sign in to your seller account' : 'Create your seller account'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Tab Switcher */}
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${isLogin
                                ? 'bg-white text-purple-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/register')}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${!isLogin
                                ? 'bg-white text-purple-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start">
                            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="font-medium">Registration Successful!</p>
                                <p className="text-sm">Please login with your credentials to continue.</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don&apos;ve an account?{' '}
                            <button
                                onClick={() => router.push('/register')}
                                className="text-purple-600 hover:underline font-medium"
                            >
                                Register as a seller
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        }>
            <AuthPageContent />
        </Suspense>
    );
}
