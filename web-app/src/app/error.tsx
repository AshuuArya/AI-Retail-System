'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

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
        <div className="min-h-screen bg-[#030711] flex flex-col items-center justify-center p-6 text-center selection:bg-red-500/30">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-lg glass-surface-strong p-12 rounded-[2.5rem] border border-red-500/20 shadow-2xl shadow-red-950/20 overflow-hidden"
            >
                {/* Decorative background pulse */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-red-500/50 blur-xl animate-pulse" />

                <div className="flex justify-center mb-8">
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -10, 10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500"
                    >
                        <AlertTriangle size={40} />
                    </motion.div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                    <Terminal size={14} className="text-red-500" />
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Critical System Failure</span>
                </div>

                <h2 className="text-3xl font-bold premium-gradient-text mb-4 tracking-tighter">
                    Stream <span className="text-red-500 italic">Interrupted</span>
                </h2>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-10 text-left font-mono">
                    <p className="text-red-400 text-sm break-words">
                        {error.message || 'An unhandled exception occurred in the core processing unit.'}
                    </p>
                    {error.digest && (
                        <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest border-t border-white/5 pt-4">
                            Digest: {error.digest}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                        onClick={() => reset()}
                        className="h-14 bg-red-600 hover:bg-red-500 shadow-[0_0_25px_rgba(220,38,38,0.2)] border-red-400/20"
                    >
                        <RefreshCw size={18} className="mr-2" />
                        Re-initialize
                    </Button>
                    <Link href="/dashboard" className="w-full">
                        <Button
                            variant="secondary"
                            className="h-14 w-full"
                        >
                            <Home size={18} className="mr-2" />
                            Safe Mode
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
