'use client';

import React, { useState } from 'react';

interface AIDescriptionGeneratorProps {
    productName: string;
    category?: string;
    brand?: string;
    currentDescription?: string;
    onDescriptionGenerated: (description: string) => void;
}

export default function AIDescriptionGenerator({
    productName,
    category,
    brand,
    currentDescription,
    onDescriptionGenerated
}: AIDescriptionGeneratorProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tone, setTone] = useState<'professional' | 'casual' | 'technical' | 'marketing'>('professional');

    const generateDescription = async () => {
        if (!productName.trim()) {
            setError('Please enter a product name first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/generate-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'generate',
                    productName,
                    category,
                    brand,
                    tone
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate description');
            }

            onDescriptionGenerated(data.description);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const improveDescription = async () => {
        if (!currentDescription?.trim()) {
            setError('Please enter a description to improve');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/generate-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'improve',
                    currentDescription,
                    tone
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to improve description');
            }

            onDescriptionGenerated(data.description);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✨</span>
                <h4 className="font-semibold text-gray-900">AI Description Assistant</h4>
            </div>

            {error && (
                <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone
                </label>
                <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    disabled={loading}
                >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual & Friendly</option>
                    <option value="technical">Technical</option>
                    <option value="marketing">Marketing & Sales</option>
                </select>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={generateDescription}
                    disabled={loading || !productName.trim()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⚙️</span>
                            Generating...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span>🤖</span>
                            Generate
                        </span>
                    )}
                </button>

                {currentDescription && (
                    <button
                        onClick={improveDescription}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        {loading ? 'Improving...' : '✨ Improve'}
                    </button>
                )}
            </div>

            <p className="text-xs text-gray-600 mt-2">
                💡 AI will create a compelling description based on your product details
            </p>
        </div>
    );
}
