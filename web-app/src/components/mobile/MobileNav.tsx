'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface MobileNavProps {
    navigation: Array<{
        name: string;
        href: string;
        icon: any;
    }>;
}

export default function MobileNav({ navigation }: MobileNavProps) {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-surface-strong rounded-[2.5rem] border border-white/10 shadow-2xl p-2.5 flex justify-around items-center h-20"
            >
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center flex-1 h-14 transition-all duration-300 ${isActive ? 'text-blue-400' : 'text-slate-500'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-pill"
                                    className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-[1.5rem]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <div className={`z-10 transition-transform ${isActive ? 'scale-110' : ''}`}>
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`z-10 text-[9px] font-black uppercase tracking-[0.1em] mt-1.5 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </motion.div>
        </nav>
    );
}
