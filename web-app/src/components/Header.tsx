'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { LogOut, User, LayoutGrid, Package, Users, Receipt, Settings } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
        { name: 'Customers', href: '/dashboard/customers', icon: Users },
        { name: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-50 glass-surface border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-24">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Package size={22} />
                        </div>
                        <div className="hidden lg:block">
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                RetailSync
                            </h1>
                            <p className="text-[10px] text-slate-400 font-medium">
                                {user?.companyName || 'Store Manager'}
                            </p>
                        </div>
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center gap-1 bg-white/[0.05] p-1 rounded-xl border border-white/10">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${isActive
                                        ? 'text-white bg-blue-600 shadow-md'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                            <User size={20} />
                        </div>
                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                            className="h-10 px-4 rounded-xl text-xs font-semibold border-white/10 hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
