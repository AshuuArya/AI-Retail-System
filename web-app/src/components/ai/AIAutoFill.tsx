'use client';

import { useState } from 'react';
import { autoFillProductData } from '@/lib/ai/gemini';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Sparkles,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Layers,
    Activity,
    Scan
} from 'lucide-react';

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
            const data = await autoFillProductData(productName);
            if (!data || Object.keys(data).length === 0) {
                throw new Error('AI returned empty data. Please try again.');
            }
            onDataGenerated(data);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to generate product data';
            if (errorMessage.includes('API key')) {
                setError('Gemini API key not configured. Check .env.local');
            } else if (errorMessage.includes('quota')) {
                setError('API quota exceeded.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2"
                    >
                        <AlertTriangle size={14} />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Cpu size={24} className={loading ? 'animate-pulse' : ''} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-white tracking-tight">Neural Asset Synthesis</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">AI-Powered Metadata Generation</p>
                    </div>
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !productName.trim() || productName.length < 3}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 glow-border"
                    isLoading={loading}
                >
                    <Sparkles size={18} className="mr-2" />
                    {loading ? 'Synthesizing Data...' : 'Generate Node Profile'}
                </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { title: 'Metadata Stream', items: ['Category Mapping', 'Pricing Estimation'], icon: Layers },
                        { title: 'Operational Logic', items: ['SKU Generation', 'Stock Thresholds'], icon: Scan },
                    ].map((section, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <section.icon size={12} className="text-blue-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{section.title}</span>
                            </div>
                            <ul className="space-y-2">
                                {section.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-[10px] text-slate-500">
                                        <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <Activity size={14} className="text-blue-500" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Input precise model/name for optimal neural outcomes.
                    </p>
                </div>
            </div>
        </div>
    );
}
