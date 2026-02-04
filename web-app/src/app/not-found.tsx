'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center p-6 text-center">
            <div className="glass-card max-w-md w-full p-12 rounded-3xl border border-white/10 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-[100px] rounded-full"></div>

                <div className="relative z-10">
                    <div className="text-8xl mb-8 animate-float drop-shadow-[0_0_25px_rgba(147,51,234,0.3)]">🔍</div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">404 - Lost in Space</h2>
                    <p className="text-gray-400 mb-10 leading-relaxed font-medium">
                        The page you're searching for seems to have vanished into the digital void.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block w-full py-4 premium-gradient text-white rounded-2xl font-bold shadow-lg shadow-purple-500/25 hover:scale-[1.03] active:scale-95 transition-all duration-300"
                    >
                        Return to Base
                    </Link>
                </div>
            </div>
        </div>
    );
}
