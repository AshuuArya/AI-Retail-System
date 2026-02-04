'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useOptimization';

interface Invoice {
    $id: string;
    invoiceNumber: string;
    customerId: string;
    customerName: string;
    total: number;
    status: 'paid' | 'pending' | 'cancelled';
    paymentMethod: string;
    $createdAt: string;
}

export default function InvoicesPage() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (user) {
            fetchInvoices();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchInvoices();
        }
    }, [debouncedSearchTerm, statusFilter]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                sellerId: user?.$id || ''
            });

            if (debouncedSearchTerm) {
                params.append('search', debouncedSearchTerm);
            }

            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            const response = await fetch(`/api/invoices?${params}`);
            const data = await response.json();

            if (response.ok) {
                setInvoices(data.invoices || []);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
                        Financial <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">Ledger</span> 📄
                    </h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-2xl font-medium">
                        Comprehensive transaction monitoring and fiscal reporting protocols.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-primary/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Volume</p>
                                <p className="text-3xl font-black text-foreground">{invoices.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                <span className="text-2xl text-primary">📄</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-green-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Settled</p>
                                <p className="text-3xl font-black text-green-500">{paidInvoices}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                                <span className="text-2xl text-green-500">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-yellow-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Awaiting</p>
                                <p className="text-3xl font-black text-yellow-500">{pendingInvoices}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
                                <span className="text-2xl text-yellow-500">⏳</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-purple-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Gross Revenue</p>
                                <p className="text-3xl font-black text-purple-500">₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                                <span className="text-2xl text-purple-500">💰</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="glass-card rounded-2xl p-6 mb-8 border border-white/5">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto relative">
                            <input
                                type="text"
                                placeholder="Locate transaction hash..."
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

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-12 px-4 bg-white/5 border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 text-foreground text-xs font-bold uppercase tracking-widest"
                        >
                            <option value="all" className="bg-card">All Vectors</option>
                            <option value="paid" className="bg-card">SETTLED</option>
                            <option value="pending" className="bg-card">PENDING</option>
                            <option value="cancelled" className="bg-card">REVOKED</option>
                        </select>

                        <Link
                            href="/dashboard/invoices/create"
                            className="h-12 px-8 premium-gradient text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest text-xs shadow-lg shadow-purple-500/20"
                        >
                            <span>+</span>
                            <span>Generate Invoice</span>
                        </Link>
                    </div>
                </div>

                {/* Invoices List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="mt-4 text-gray-600">Loading invoices...</p>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices yet</h3>
                        <p className="text-gray-600 mb-6">Create your first invoice to start tracking sales</p>
                        <Link
                            href="/dashboard/invoices/create"
                            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Create Your First Invoice
                        </Link>
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/5">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Vector ID
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Target Identity
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Timestamp
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Financial Sum
                                        </th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Status
                                        </th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.$id} className="hover:bg-white/[0.02] group transition-colors">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tighter">{invoice.invoiceNumber}</div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-bold text-foreground">{invoice.customerName || 'ANONYMOUS_ENTITY'}</div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {new Date(invoice.$createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-black text-foreground">₹{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${invoice.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : invoice.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-right">
                                                <Link
                                                    href={`/dashboard/invoices/${invoice.$id}`}
                                                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
                                                    title="Inspect Transaction"
                                                >
                                                    👁️
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
