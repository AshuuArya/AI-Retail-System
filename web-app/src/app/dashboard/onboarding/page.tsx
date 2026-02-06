'use client';

import React from 'react';
import Link from 'next/link';

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-[#0f111a] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        🎉 Welcome to Your Inventory Setup!
                    </h1>
                    <p className="text-muted-foreground">
                        Let&apos;s customize your inventory fields to match your business needs
                    </p>
                </div>

                <div className="glass-card rounded-2xl shadow-xl border border-white/10 p-8">
                    <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🚀</span>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">
                            Onboarding Wizard Coming Soon
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            This wizard will help you:
                        </p>
                        <div className="text-left max-w-md mx-auto mb-8 space-y-3">
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="text-muted-foreground">Choose which product fields you need</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="text-muted-foreground">Add custom fields specific to your business</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="text-muted-foreground">Configure AI-powered features</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-3">✓</span>
                                <span className="text-muted-foreground">Add your first product with guided help</span>
                            </div>
                        </div>
                        <Link
                            href="/dashboard"
                            className="inline-block premium-gradient text-white px-6 py-3 rounded-lg hover:scale-[1.02] transition-all font-medium shadow-lg shadow-purple-500/25"
                        >
                            Skip for Now → Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
