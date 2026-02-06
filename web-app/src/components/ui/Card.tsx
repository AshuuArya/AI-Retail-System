'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    footer?: React.ReactNode;
    padding?: string;
    hover?: boolean;
    delay?: number;
}

export const Card = ({
    children,
    title,
    subtitle,
    className = '',
    footer,
    padding = 'p-8',
    hover = true,
    delay = 0
}: CardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay, ease: [0.23, 1, 0.32, 1] }}
        whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
        className={`glass-surface rounded-[2rem] overflow-hidden obsidian-card group ${className}`}
    >
        {(title || subtitle) && (
            <div className="px-10 py-6 border-b border-white/5 bg-white/[0.01]">
                {title && <h3 className="text-xl font-bold premium-gradient-text tracking-tight">{title}</h3>}
                {subtitle && <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{subtitle}</p>}
            </div>
        )}
        <div className={padding}>
            {children}
        </div>
        {footer && (
            <div className="px-10 py-5 border-t border-white/5 bg-white/[0.01]">
                {footer}
            </div>
        )}

        {/* Subtle inner glow on hover */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
);
