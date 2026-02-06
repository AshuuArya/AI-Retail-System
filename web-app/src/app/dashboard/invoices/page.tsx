'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useOptimization';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Receipt,
    Plus,
    Search,
    Filter,
    Calendar,
    CreditCard,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    Clock,
    XCircle,
    Eye
} from 'lucide-react';

interface Invoice {
    id: string;
    invoiceNumber: string;
    customerId: string;
    customerName: string;
    total: number;
    status: 'paid' | 'pending' | 'cancelled';
    paymentMethod: string;
    createdAt: string;
}

export default function InvoicesPage() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (user?.$id) fetchInvoices();
    }, [user, debouncedSearchTerm, statusFilter]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ sellerId: user?.$id || '' });
            if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
            if (statusFilter !== 'all') params.append('status', statusFilter);

            const response = await fetch(`/api/invoices?${params}`);
            const data = await response.json();
            if (response.ok) setInvoices(data.invoices || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
    const totalCount = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8"
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Receipt size={16} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Financial Management</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Invoices & Billing
                    </h1>
                    <p className="text-sm text-slate-400">
                        Track and manage your <span className="text-white font-semibold">store revenue</span> and billing transactions.
                    </p>
                </div>
                <Link href="/dashboard/invoices/create">
                    <Button className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 border-0 shadow-lg shadow-blue-600/20">
                        <Plus size={18} className="mr-2" />
                        Create Invoice
                    </Button>
                </Link>
            </motion.div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: `₹${(totalRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: 'blue' },
                    { label: 'Total Invoices', value: totalCount, icon: Receipt, color: 'purple' },
                    { label: 'Paid', value: paidInvoices, icon: CheckCircle2, color: 'emerald' },
                    { label: 'Pending', value: pendingInvoices, icon: Clock, color: 'orange' },
                ].map((stat, i) => (
                    <Card key={i} className="border-white/5" padding="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400`}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-0.5">{stat.label}</p>
                                <p className="text-xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Table section */}
            <Card className="border-white/5 overflow-hidden" padding="p-0">
                <div className="p-6 border-b border-white/10 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-md w-full">
                        <Input
                            placeholder="Search by invoice # or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 rounded-lg"
                            icon={<Search size={16} />}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-slate-500">Filter Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 outline-none h-10"
                        >
                            <option value="all">All Invoices</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Invoice Details</th>
                                <th className="px-8 py-5">Customer</th>
                                <th className="px-8 py-5 text-right">Total</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {loading && invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="inline-block w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Invoices...</p>
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.map((invoice, idx) => (
                                        <motion.tr
                                            key={invoice.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="hover:bg-white/[0.02] transition-colors group/row"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-blue-400">{invoice.invoiceNumber}</span>
                                                    <span className="text-[10px] text-slate-500">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-semibold text-slate-300">{invoice.customerName}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="text-xs font-bold text-white">₹{(invoice.total ?? 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <Badge
                                                    variant={invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'danger'}
                                                    className="px-3 py-1 text-[10px] font-bold"
                                                >
                                                    {invoice.status}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Link href={`/dashboard/invoices/${invoice.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-white/5">
                                                        <Eye size={14} className="text-slate-400" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
