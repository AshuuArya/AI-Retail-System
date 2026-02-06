'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = ({ label, error, icon, className = '', ...props }: InputProps) => (
    <div className="space-y-2 group">
        {label && (
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-400">
                {label}
            </label>
        )}
        <div className="relative">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    {icon}
                </div>
            )}
            <input
                {...props}
                className={`
                    w-full ${icon ? 'pl-12' : 'px-4'} py-3 
                    bg-white/5 border border-white/10 rounded-xl 
                    text-slate-200 text-sm placeholder:text-slate-600 
                    outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50
                    transition-all duration-300
                    ${error ? 'border-red-500/50 bg-red-500/5' : ''}
                    ${className}
                `}
            />
        </div>
        {error && <p className="text-xs text-red-400 font-medium ml-1 animate-pulse">{error}</p>}
    </div>
);

export const TextArea = ({ label, error, className = '', ...props }: any) => (
    <div className="space-y-2 group">
        {label && (
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-400">
                {label}
            </label>
        )}
        <textarea
            {...props}
            className={`
                w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-slate-200 text-sm placeholder:text-slate-600 outline-none
                focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50
                transition-all duration-300 min-h-[120px] resize-none
                ${error ? 'border-red-500/50 bg-red-500/5' : ''}
                ${className}
            `}
        />
        {error && <p className="text-xs text-red-400 font-medium ml-1 animate-pulse">{error}</p>}
    </div>
);
