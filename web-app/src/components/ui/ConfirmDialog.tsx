'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    isLoading = false
}: ConfirmDialogProps) {

    // Close on ESC
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onCancel]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="relative w-full max-w-md glass-surface-strong rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Status bar */}
                        <div className="h-1.5 w-full bg-red-500/20">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-red-500"
                            />
                        </div>

                        <div className="p-8">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
                                    <AlertTriangle size={24} />
                                </div>
                                <button
                                    onClick={onCancel}
                                    className="p-2 text-slate-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold premium-gradient-text mb-2">{title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={onCancel}
                                    className="flex-1"
                                    disabled={isLoading}
                                >
                                    Abort
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={onConfirm}
                                    className="flex-1 shadow-[0_0_20px_rgba(239, 68, 68, 0.2)]"
                                    isLoading={isLoading}
                                >
                                    {confirmText}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
