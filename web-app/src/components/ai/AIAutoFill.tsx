'use client';

import { useState } from 'react';
import { autoFillProductData } from '@/lib/ai/gemini';

interface AIAutoFillProps {
    productName: string;
    onDataGenerated: (data: any) => void;
}

export default function AIAutoFill({ productName, onDataGenerated }: AIAutoFillProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!productName.trim() || productName.length < 3) {
            setError('Please enter a product name (at least 3 characters)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('🤖 Calling Gemini AI with product name:', productName);
            const data = await autoFillProductData(productName);
            console.log('✅ AI Response received:', data);

            if (!data || Object.keys(data).length === 0) {
                throw new Error('AI returned empty data. Please try again.');
            }

            onDataGenerated(data);
        } catch (err: any) {
            console.error('❌ AI Auto-fill error:', err);
            const errorMessage = err.message || 'Failed to generate product data';

            // Provide more helpful error messages
            if (errorMessage.includes('API key')) {
                setError('⚠️ Gemini API key not configured. Please add your API key to .env.local file.');
            } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
                setError('⚠️ API quota exceeded. Please check your Gemini API usage.');
            } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                setError('⚠️ Network error. Please check your internet connection.');
            } else {
                setError(`⚠️ ${errorMessage}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card rounded-2xl p-8 mb-8 border-2 border-primary/20 relative overflow-hidden group shadow-2xl shadow-primary/10">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>

            <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-primary/30 animate-float">
                    🤖
                </div>
                <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">AI Product Assistant</h3>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Smart Product Data Generation</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    {error}
                </div>
            )}

            <button
                onClick={handleGenerate}
                disabled={loading || !productName.trim() || productName.length < 3}
                className="w-full h-16 premium-gradient text-white rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale font-black text-xl shadow-xl shadow-primary/20 flex items-center justify-center gap-4 group"
            >
                {loading ? (
                    <>
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="uppercase tracking-widest text-base">Generating Details...</span>
                    </>
                ) : (
                    <>
                        <span>✨</span>
                        <span className="uppercase tracking-widest text-base">Generate Complete Profile</span>
                        <span className="group-hover:translate-x-1 transition-transform">🚀</span>
                    </>
                )}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-white/5 border border-border/50 rounded-2xl p-6">
                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">How it works</p>
                    <ul className="text-xs text-muted-foreground space-y-3 font-medium">
                        <li className="flex items-center gap-2">
                            <span className="text-primary">✦</span> Suggests Specifications
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-primary">✦</span> Suggests Categories
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-primary">✦</span> Estimates Pricing
                        </li>
                    </ul>
                </div>

                <div className="bg-white/5 border border-border/50 rounded-2xl p-6">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Smart Details</p>
                    <ul className="text-xs text-muted-foreground space-y-3 font-medium">
                        <li className="flex items-center gap-2">
                            <span className="text-blue-400">✦</span> Extracts Metadata
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-blue-400">✦</span> Suggests Stock Limits
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-blue-400">✦</span> Generates SKU Codes
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-3 text-muted-foreground bg-secondary/50 p-4 rounded-xl border border-border/30">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[10px] font-bold uppercase tracking-widest">
                    Tip: Enter specific brand/model for better results (e.g., &quot;iPhone 15 Pro&quot;)
                </p>
            </div>
        </div>
    );
}
