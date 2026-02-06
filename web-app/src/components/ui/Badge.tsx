'use client';

import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

export const Badge = ({ children, variant = 'neutral', className = '' }: BadgeProps) => {
    const styles = {
        neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        danger: "bg-red-500/10 text-red-400 border-red-500/20",
        info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    return (
        <span className={`
            px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] 
            rounded-md border backdrop-blur-md shadow-[0_0_10px_rgba(0,0,0,0.1)]
            ${styles[variant]} ${className}
        `}>
            {children}
        </span>
    );
};
