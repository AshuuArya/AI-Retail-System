'use client';

import React from 'react';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import OfflineIndicator from '@/components/OfflineIndicator';
import MobileNav from '@/components/mobile/MobileNav';
import { motion, AnimatePresence } from 'framer-motion';

import { LayoutGrid, Package, Users, Receipt, Settings } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
        { name: 'Customers', href: '/dashboard/customers', icon: Users },
        { name: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-blue-500/30">
                <OfflineIndicator />
                <Header />
                <main className="flex-1 relative pb-20 md:pb-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            key="dashboard-content"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
                <MobileNav navigation={navigation} />
            </div>
        </ProtectedRoute>
    );
}
