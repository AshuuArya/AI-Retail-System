'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useOptimization';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { exportCustomersToCSV } from '@/lib/exportUtils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    Search,
    Download,
    Mail,
    Phone,
    MapPin,
    TrendingUp,
    Calendar,
    Target,
    MoreHorizontal,
    Edit3,
    Trash2
} from 'lucide-react';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    totalPurchases: number;
    lastPurchaseDate: string;
}

export default function CustomersPage() {
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
        if (user?.$id) fetchCustomers();
    }, [user, debouncedSearchTerm]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ sellerId: user?.$id || '' });
            if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);

            const response = await fetch(`/api/customers?${params}`);
            const data = await response.json();
            if (response.ok) setCustomers(data.customers || []);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (customerId: string, customerName: string) => {
        setDeleteDialog({ isOpen: true, customerId, customerName });
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/customers/${deleteDialog.customerId}`, { method: 'DELETE' });
            if (response.ok) {
                setCustomers(customers.filter(c => c.id !== deleteDialog.customerId));
                setDeleteDialog({ isOpen: false, customerId: '', customerName: '' });
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const totalDatabase = customers.length;
    const activeRetained = customers.filter(c => {
        if (!c.lastPurchaseDate) return false;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(c.lastPurchaseDate) >= thirtyDaysAgo;
    }).length;
    const lifetimeYield = customers.reduce((sum, c) => sum + (c.totalPurchases || 0), 0);

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
                        <Users size={16} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Customer Management</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Customer Directory
                    </h1>
                    <p className="text-sm text-slate-400">
                        Manage your relationship with <span className="text-white font-semibold">{customers.length} customers</span>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={() => exportCustomersToCSV(customers)} className="h-10 px-4 rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                        <Download size={16} className="mr-2" />
                        Export List
                    </Button>
                    <Link href="/dashboard/customers/add">
                        <Button className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 border-0 shadow-lg shadow-blue-600/20">
                            <UserPlus size={18} className="mr-2" />
                            Add Customer
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Customers', value: totalDatabase, icon: Users, color: 'blue' },
                    { label: 'Active (30 Days)', value: activeRetained, icon: TrendingUp, color: 'emerald' },
                    { label: 'Total Revenue', value: `₹${(lifetimeYield ?? 0).toLocaleString()}`, icon: Target, color: 'purple' },
                ].map((stat, i) => (
                    <Card key={i} className="border-white/5" padding="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Search & Table */}
            <Card className="border-white/5 overflow-hidden" padding="p-0">
                <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                    <div className="max-w-md">
                        <Input
                            placeholder="Search by name, email or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 rounded-lg"
                            icon={<Search size={16} />}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Customer Details</th>
                                <th className="px-8 py-5">Location</th>
                                <th className="px-8 py-5 text-right">Total Spent</th>
                                <th className="px-8 py-5 text-center">Last Order</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {loading && customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="inline-block w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Customers...</p>
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer, idx) => (
                                        <motion.tr
                                            key={customer.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="hover:bg-white/[0.02] transition-colors group/row"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-200">{customer.name}</span>
                                                    <span className="text-[10px] text-slate-500">{customer.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <MapPin size={12} className="text-slate-600" />
                                                    {customer.city}, {customer.state}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="text-xs font-bold text-white">₹{(customer.totalPurchases ?? 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className="text-[10px] font-medium text-slate-500">
                                                    {customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate).toLocaleDateString() : 'No orders'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/dashboard/customers/edit/${customer.id}`}>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-white/5">
                                                            <Edit3 size={14} className="text-slate-400" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(customer.id, customer.name)}
                                                        className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/10 hover:text-red-400"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </Card>

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onCancel={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={handleDeleteConfirm}
                title="Remove Customer"
                message={`Are you sure you want to remove ${deleteDialog.customerName} from your directory? This will not affect their past order history.`}
            />
        </div>
    );
}
