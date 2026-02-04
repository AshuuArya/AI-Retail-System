'use client';

import React, { useState } from 'react';

interface AIPricingSuggestionProps {
    productName: string;
    category?: string;
    costPrice?: number;
    onPriceSuggested: (price: number) => void;
}

export default function AIPricingSuggestion({
    productName,
    category,
    costPrice,
    onPriceSuggested
}: AIPricingSuggestionProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestion, setSuggestion] = useState<{
        suggestedPrice: number;
        reasoning: string;
        priceRange: { min: number; max: number };
    } | null>(null);

    const getSuggestion = async () => {
        if (!productName.trim()) {
            setError('Please enter a product name first');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/suggest-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName,
                    category,
                    costPrice
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get price suggestion');
            }

            setSuggestion({
                suggestedPrice: data.suggestedPrice,
                reasoning: data.reasoning,
                priceRange: data.priceRange
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const applyPrice = () => {
        if (suggestion) {
            onPriceSuggested(suggestion.suggestedPrice);
            setSuggestion(null);
        }
    };

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💰</span>
                <h4 className="font-semibold text-gray-900">AI Pricing Assistant</h4>
            </div>

            {error && (
                <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                </div>
            )}

            {suggestion ? (
                <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-green-300">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-2xl font-bold text-green-600">
                                ₹{suggestion.suggestedPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-600">
                                (Range: ₹{suggestion.priceRange.min} - ₹{suggestion.priceRange.max})
                            </span>
                        </div>
                        <p className="text-sm text-gray-700">{suggestion.reasoning}</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={applyPrice}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            ✓ Apply Price
                        </button>
                        <button
                            onClick={() => setSuggestion(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <button
                        onClick={getSuggestion}
                        disabled={loading || !productName.trim()}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⚙️</span>
                                Analyzing...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span>🤖</span>
                                Get AI Price Suggestion
                            </span>
                        )}
                    </button>

                    <p className="text-xs text-gray-600 mt-2">
                        💡 AI will suggest optimal pricing based on cost and market standards
                    </p>
                </>
            )}
        </div>
    );
}
