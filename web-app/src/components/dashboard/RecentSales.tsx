'use client';

import React from 'react';
import Link from 'next/link';

interface RecentSale {
    id: string;
    invoiceNumber: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
}

interface RecentSalesProps {
    sales: RecentSale[];
}

export default function RecentSales({ sales }: RecentSalesProps) {
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sales</h3>
                <Link
                    href="/dashboard/invoices"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                    View all →
                </Link>
            </div>

            {sales.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No sales yet</p>
                    <Link
                        href="/dashboard/invoices/create"
                        className="inline-block mt-2 text-sm text-purple-600 hover:text-purple-700"
                    >
                        Create your first invoice
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {sales.map((sale) => (
                        <Link
                            key={sale.id}
                            href={`/dashboard/invoices/${sale.id}`}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300">
                                        {sale.customerName || 'Walk-in Customer'}
                                    </p>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                                        {sale.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    {sale.invoiceNumber} • {getTimeAgo(sale.date)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900 dark:text-white">₹{sale.total.toFixed(2)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
