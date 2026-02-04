'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Root Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center p-6 text-center">
            <div className="glass-card max-w-md w-full p-12 rounded-3xl border border-white/10">
                <div className="text-6xl mb-6 animate-float">⚠️</div>
                <h2 className="text-2xl font-bold text-white mb-3">System Encountered an Error</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    {error.message || 'An unexpected error occurred while loading the application.'}
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => reset()}
                        className="w-full py-4 premium-gradient text-white rounded-2xl font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-transform"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
                {error.digest && (
                    <p className="mt-6 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                        Error Digest: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
