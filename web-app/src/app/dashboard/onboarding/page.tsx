'use client';

import React from 'react';
import Link from 'next/link';

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        🎉 Welcome to Your Inventory Setup!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Let's customize your inventory fields to match your business needs
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-8">
                    <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🚀</span>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Onboarding Wizard Coming Soon
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                            This wizard will help you:
                        </p>
                        <div className="text-left max-w-md mx-auto mb-8 space-y-3">
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Choose which product fields you need</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Add custom fields specific to your business</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Configure AI-powered features</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Add your first product with guided help</span>
                            </div>
                        </div>
                        <Link
                            href="/dashboard"
                            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            Skip for Now → Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
