'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useOptimization';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { exportCustomersToCSV } from '@/lib/exportUtils';

interface Customer {
    $id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    totalPurchases: number;
    lastPurchaseDate: string;
}

export default function CustomersPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; customerId: string; customerName: string }>({
        isOpen: false,
        customerId: '',
        customerName: ''
    });

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (user) {
            fetchCustomers();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCustomers();
        }
    }, [debouncedSearchTerm]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                sellerId: user?.$id || ''
            });

            if (debouncedSearchTerm) {
                params.append('search', debouncedSearchTerm);
            }

            const response = await fetch(`/api/customers?${params}`);
            const data = await response.json();

            if (response.ok) {
                setCustomers(data.customers || []);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (customerId: string, customerName: string) => {
        setDeleteDialog({
            isOpen: true,
            customerId,
            customerName
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/customers/${deleteDialog.customerId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove customer from list
                setCustomers(customers.filter(c => c.$id !== deleteDialog.customerId));
                setDeleteDialog({ isOpen: false, customerId: '', customerName: '' });
            } else {
                const data = await response.json();
                alert(`Failed to delete customer: ${data.error}`);
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Failed to delete customer');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ isOpen: false, customerId: '', customerName: '' });
    };

    const totalCustomers = customers.length;
    const recentCustomers = customers.filter(c => {
        if (!c.lastPurchaseDate) return false;
        const lastPurchase = new Date(c.lastPurchaseDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastPurchase >= thirtyDaysAgo;
    }).length;

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
                        Customer <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">Intelligence</span> 👥
                    </h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-2xl font-medium">
                        Analyze and manage your retail relationships with deep data insights.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-blue-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Database</p>
                                <p className="text-3xl font-black text-foreground">{totalCustomers}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <span className="text-2xl text-blue-500">👥</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-green-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Retained (30 Days)</p>
                                <p className="text-3xl font-black text-green-500">{recentCustomers}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                                <span className="text-2xl text-green-500">⚡</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-purple-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Lifetime Yield</p>
                                <p className="text-3xl font-black text-purple-500">
                                    ₹{customers.reduce((sum, c) => sum + (c.totalPurchases || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                                <span className="text-2xl text-purple-500">💎</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Actions */}
                <div className="glass-card rounded-2xl p-6 mb-8 border border-white/5">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto relative">
                            <input
                                type="text"
                                placeholder="Scan or search identifiers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 text-foreground transition-all placeholder:text-muted-foreground/50"
                            />
                            {searchTerm && searchTerm !== debouncedSearchTerm && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 w-full md:w-auto">
                            <button
                                onClick={() => exportCustomersToCSV(customers)}
                                disabled={customers.length === 0}
                                className="h-12 px-6 bg-secondary border border-border/50 text-foreground font-bold rounded-xl hover:bg-muted transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px]"
                            >
                                📥 Export Repository
                            </button>
                            <Link
                                href="/dashboard/customers/add"
                                className="h-12 px-6 premium-gradient text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest text-[10px] shadow-lg shadow-purple-500/20"
                            >
                                <span>+</span>
                                <span>Initialize Entry</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Customers List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading customers...</p>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No customers yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Start by adding your first customer</p>
                        <Link
                            href="/dashboard/customers/add"
                            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Add Your First Customer
                        </Link>
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/5">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Core Identity
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Channel Link
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Geographic Sector
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Financial Rank
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">
                                            Operations
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {customers.map((customer) => (
                                        <tr key={customer.$id} className="hover:bg-white/[0.02] group transition-colors">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                                                        {customer.name.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{customer.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-foreground">{customer.phone}</div>
                                                <div className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">{customer.email || 'NO_LINK'}</div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">
                                                    {customer.city && customer.state
                                                        ? `${customer.city} × ${customer.state}`
                                                        : customer.city || customer.state || 'UNDETERMINED'
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-black text-green-500">
                                                    ₹{customer.totalPurchases?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-right">
                                                <div className="flex gap-3 justify-end">
                                                    <Link
                                                        href={`/dashboard/customers/edit/${customer.$id}`}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all active:scale-90"
                                                        title="Refine Profile"
                                                    >
                                                        ✏️
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(customer.$id, customer.name)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-border/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-90"
                                                        title="Purge Record"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={deleteDialog.isOpen}
                    title="Delete Customer"
                    message={`Are you sure you want to delete "${deleteDialog.customerName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            </div>
        </div >
    );
}
