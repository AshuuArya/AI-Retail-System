'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    isLoading?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading,
    disabled,
    ...props
}: ButtonProps) => {

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-base",
    };

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-blue-400/20",
        secondary: "glass-surface text-slate-200 hover:bg-white/10 hover:text-white border-white/10",
        ghost: "text-slate-400 hover:text-white hover:bg-white/5",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, translateY: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative inline-flex items-center justify-center font-semibold rounded-xl 
                transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none
                ${sizes[size]} ${variants[variant]} ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};
