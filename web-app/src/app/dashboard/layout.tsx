import React from 'react';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import OfflineIndicator from '@/components/OfflineIndicator';
import MobileNav from '@/components/mobile/MobileNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Inventory', href: '/dashboard/inventory', icon: '📦' },
        { name: 'Customers', href: '/dashboard/customers', icon: '👥' },
        { name: 'Invoices', href: '/dashboard/invoices', icon: '📄' },
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
                <OfflineIndicator />
                <Header />
                <main className="dark:bg-slate-950 pb-20 md:pb-0">
                    {children}
                </main>
                <MobileNav navigation={navigation} />
            </div>
        </ProtectedRoute>
    );
}
