'use client';

import React, { useState } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'danger'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            bg: 'bg-red-500 shadow-red-500/20',
            border: 'border-red-500/20',
            text: 'text-red-500',
            bgLight: 'bg-red-500/10',
            icon: '⚠️'
        },
        warning: {
            bg: 'bg-orange-500 shadow-orange-500/20',
            border: 'border-orange-500/20',
            text: 'text-orange-500',
            bgLight: 'bg-orange-500/10',
            icon: '⚡'
        },
        info: {
            bg: 'bg-blue-500 shadow-blue-500/20',
            border: 'border-blue-500/20',
            text: 'text-blue-500',
            bgLight: 'bg-blue-500/10',
            icon: 'ℹ️'
        }
    };

    const style = variantStyles[variant];

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="glass-card rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/10 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center text-center gap-6">
                    <div className={`w-20 h-20 ${style.bgLight} ${style.border} border rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
                        {style.icon}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-10">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-14 bg-secondary border border-border/50 text-foreground font-bold rounded-2xl hover:bg-muted transition-all active:scale-95 uppercase tracking-widest text-xs"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 h-14 ${style.bg} text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
