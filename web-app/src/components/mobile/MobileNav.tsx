'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavProps {
    navigation: Array<{
        name: string;
        href: string;
        icon: string;
    }>;
}

export default function MobileNav({ navigation }: MobileNavProps) {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 z-40 safe-area-inset-bottom">
            <div className="flex justify-around items-center h-20 px-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-14 rounded-2xl transition-all duration-300 ${isActive
                                ? 'text-primary bg-primary/10 shadow-lg shadow-primary/5 scale-110'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            <span className={`text-2xl mb-1 ${isActive ? 'animate-bounce' : ''}`}>{item.icon}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
