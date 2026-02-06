'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    AlertCircle,
    Wallet,
    ShoppingCart,
    ArrowRight,
    Plus,
    FileText,
    Settings,
    Sparkles,
    Users as UsersIcon
} from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockCount: 0,
        inventoryValue: 0,
        categoriesCount: 0,
        totalSales: 0,
        avgOrderValue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [recentSales, setRecentSales] = useState<any[]>([]);

    useEffect(() => {
        if (user?.$id) fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const params = new URLSearchParams({ sellerId: user?.$id || '' });
            const [productsRes, invoicesRes] = await Promise.all([
                fetch(`/api/products?${params}`),
                fetch(`/api/invoices?${params}`)
            ]);

            const productsData = await productsRes.json();
            const invoicesData = await invoicesRes.json();

            if (productsRes.ok && productsData.products) {
                const products = productsData.products;
                const paidInvoices = invoicesData.invoices?.filter((i: any) => i.status === 'paid') || [];
                const salesValue = paidInvoices.reduce((sum: number, i: any) => sum + (i.total || 0), 0);

                setStats({
                    totalProducts: products.length,
                    lowStockCount: products.filter((p: any) => p.quantity <= (p.lowStockThreshold || 10)).length,
                    inventoryValue: products.reduce((sum: number, p: any) => sum + ((p.sellPrice || 0) * (p.quantity || 0)), 0),
                    categoriesCount: new Set(products.map((p: any) => p.category).filter(Boolean)).size,
                    totalSales: paidInvoices.length,
                    avgOrderValue: paidInvoices.length > 0 ? salesValue / paidInvoices.length : 0,
                });
                setRecentSales(invoicesData.invoices?.slice(0, 5) || []);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-12">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/10 pb-10"
            >
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">System Live</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Main Dashboard
                    </h1>
                    <p className="text-sm text-slate-400 mt-2 max-w-xl">
                        Welcome back. Here is a summary of your <span className="text-slate-200 font-semibold">{user?.companyName}</span> operations today.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <Link href="/dashboard/invoices/create" className="flex-1 sm:flex-none">
                        <Button variant="secondary" className="w-full sm:w-auto h-11 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                            <FileText size={18} className="mr-2 text-slate-400" />
                            <span className="text-xs font-semibold">Create Invoice</span>
                        </Button>
                    </Link>
                    <Link href="/dashboard/inventory/add" className="flex-1 sm:flex-none">
                        <Button className="w-full sm:w-auto h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 border-0 shadow-lg shadow-blue-600/20">
                            <Plus size={18} className="mr-2" />
                            <span className="text-xs font-semibold">Add Product</span>
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Products', value: stats.totalProducts, icon: TrendingUp, color: 'blue', delay: 0 },
                    { label: 'Low Stock Items', value: stats.lowStockCount, icon: AlertCircle, color: 'orange', delay: 0.1 },
                    { label: 'Inventory Value', value: `₹${stats.inventoryValue.toLocaleString('en-IN')}`, icon: Wallet, color: 'emerald', delay: 0.2 },
                    { label: 'Total Sales', value: stats.totalSales, icon: ShoppingCart, color: 'purple', delay: 0.3 },
                ].map((stat, i) => (
                    <Card key={i} delay={stat.delay} className="border-white/5" padding="p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400`}>
                                    <stat.icon size={20} />
                                </div>
                                <Badge variant="neutral" className="text-[9px] bg-white/5 text-slate-400">Total</Badge>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Recent Activity Table */}
                <div className="lg:col-span-8">
                    <Card
                        title="Recent Transactions"
                        subtitle="Latest sales and order activity"
                        className="border-white/5"
                        padding="p-0"
                        delay={0.4}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Order #</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentSales.map((sale, idx) => (
                                        <motion.tr
                                            key={sale.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 + (idx * 0.05) }}
                                            className="hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-4 text-xs font-medium text-blue-400">{sale.invoiceNumber}</td>
                                            <td className="px-6 py-4 text-xs text-slate-300 font-medium">{sale.customerName}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-white">₹{(sale.total ?? 0).toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={sale.status === 'paid' ? 'success' : 'warning'} className="px-3 py-1 text-[10px] font-bold">
                                                    {sale.status}
                                                </Badge>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-4 space-y-8">
                    <Card title="Quick Links" className="border-white/5" padding="p-6" delay={0.5}>
                        <div className="space-y-3">
                            {[
                                { name: 'Customer List', icon: UsersIcon, href: '/dashboard/customers', color: 'blue' },
                                { name: 'Store Settings', icon: Settings, href: '/dashboard/settings', color: 'purple' },
                            ].map((op) => (
                                <Link key={op.name} href={op.href} className="block">
                                    <Button variant="secondary" className="w-full justify-between h-12 px-4 rounded-xl bg-white/5 border-white/10 hover:bg-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                                                <op.icon size={16} />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-300">{op.name}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-500" />
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-blue-500/20 bg-blue-500/[0.02]" padding="p-6" delay={0.6}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Sparkles size={20} />
                                </div>
                                <span className="text-xs font-bold text-blue-400">AI Insights</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                Smart analysis of your inventory turnover is complete.
                                High demand detected in "Electronics" category.
                            </p>
                            <Button className="w-full h-10 text-xs font-semibold bg-blue-600 hover:bg-blue-500 border-0">
                                View Full Report
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
