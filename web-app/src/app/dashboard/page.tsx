'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SalesChart from '@/components/dashboard/SalesChart';
import RecentSales from '@/components/dashboard/RecentSales';
import TopProducts from '@/components/dashboard/TopProducts';

interface Product {
    $id: string;
    itemName: string;
    category: string;
    sellPrice: number;
    quantity: number;
    lowStockThreshold: number;
}

interface DashboardStats {
    totalProducts: number;
    lowStockCount: number;
    inventoryValue: number;
    categoriesCount: number;
}

interface SalesAnalytics {
    totalRevenue: number;
    salesCount: number;
    avgOrderValue: number;
    revenueByDate: { [key: string]: number };
    topProducts: Array<{ id: string; name: string; quantity: number; revenue: number }>;
    recentSales: Array<{
        id: string;
        invoiceNumber: string;
        customerName: string;
        total: number;
        status: string;
        date: string;
    }>;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        lowStockCount: 0,
        inventoryValue: 0,
        categoriesCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics>({
        totalRevenue: 0,
        salesCount: 0,
        avgOrderValue: 0,
        revenueByDate: {},
        topProducts: [],
        recentSales: []
    });
    const [salesLoading, setSalesLoading] = useState(true);

    useEffect(() => {
        if (user?.$id) {
            fetchDashboardStats();
        }
    }, [user]);

    const fetchDashboardStats = async () => {
        try {
            const params = new URLSearchParams({
                sellerId: user?.$id || ''
            });

            const response = await fetch(`/api/products?${params}`);
            const data = await response.json();

            if (response.ok && data.products) {
                const products: Product[] = data.products;

                // Calculate stats
                const totalProducts = products.length;
                const lowStockCount = products.filter(p => p.quantity <= (p.lowStockThreshold || 10)).length;
                const inventoryValue = products.reduce((sum, p) => sum + ((p.sellPrice || 0) * (p.quantity || 0)), 0);
                const categoriesCount = new Set(products.map(p => p.category).filter(Boolean)).size;

                setStats({
                    totalProducts,
                    lowStockCount,
                    inventoryValue,
                    categoriesCount
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSalesAnalytics = async () => {
        try {
            const params = new URLSearchParams({
                sellerId: user?.$id || '',
                days: '30'
            });

            const response = await fetch(`/api/analytics/sales?${params}`);
            const data = await response.json();

            if (response.ok) {
                setSalesAnalytics(data);
            }
        } catch (error) {
            console.error('Error fetching sales analytics:', error);
        } finally {
            setSalesLoading(false);
        }
    };

    useEffect(() => {
        if (user?.$id) {
            fetchDashboardStats();
            fetchSalesAnalytics();
        }
    }, [user]);

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl lg:text-6xl">
                        Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">{user?.companyName}</span>! 👋
                    </h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
                        Your retail insights at a glance. Manage your inventory, sales, and customers with AI-powered precision.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-card card-hover rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Products</p>
                                <p className="text-4xl font-bold text-foreground mt-2">
                                    {loading ? (
                                        <span className="animate-pulse">...</span>
                                    ) : (
                                        stats.totalProducts
                                    )}
                                </p>
                            </div>
                            <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20">
                                <span className="text-2xl animate-float">📦</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-orange-500/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Low Stock</p>
                                <p className="text-4xl font-bold text-orange-500 mt-2">
                                    {loading ? (
                                        <span className="animate-pulse">...</span>
                                    ) : (
                                        stats.lowStockCount
                                    )}
                                </p>
                            </div>
                            <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-green-500/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Inventory Value</p>
                                <p className="text-4xl font-bold text-green-500 mt-2">
                                    {loading ? (
                                        <span className="animate-pulse">...</span>
                                    ) : (
                                        `₹${stats.inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                    )}
                                </p>
                            </div>
                            <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                                <p className="text-3xl font-bold text-purple-600 mt-1">
                                    {loading ? (
                                        <span className="animate-pulse">...</span>
                                    ) : (
                                        stats.categoriesCount
                                    )}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Analytics Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Sales Insights</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Updates
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                        {salesLoading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            `₹${salesAnalytics.totalRevenue.toFixed(2)}`
                                        )}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <span className="text-2xl">💰</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card card-hover rounded-2xl p-6 border-t-4 border-t-purple-500/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Sales</p>
                                    <p className="text-4xl font-bold text-foreground mt-2">
                                        {salesLoading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            salesAnalytics.salesCount
                                        )}
                                    </p>
                                </div>
                                <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20">
                                    <span className="text-2xl">📊</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card card-hover rounded-2xl p-6 border-t-4 border-t-blue-500/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Avg Order Value</p>
                                    <p className="text-4xl font-bold text-foreground mt-2">
                                        {salesLoading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            `₹${salesAnalytics.avgOrderValue.toFixed(2)}`
                                        )}
                                    </p>
                                </div>
                                <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                                    <span className="text-2xl font-bold text-blue-400">📈</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts and Widgets Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <SalesChart data={salesAnalytics.revenueByDate} />
                        <TopProducts products={salesAnalytics.topProducts} />
                    </div>

                    <RecentSales sales={salesAnalytics.recentSales} />
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Operations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href="/dashboard/inventory/add"
                            className="glass-card card-hover p-6 rounded-2xl border-2 border-transparent hover:border-purple-500/50 flex items-center gap-6 group"
                        >
                            <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:rotate-12 transition-transform">
                                <span className="text-3xl">➕</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground group-hover:text-purple-400 transition-colors">Add Product</h3>
                                <p className="text-sm text-muted-foreground">Intel and AI-enrich your stock</p>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/inventory"
                            className="glass-card card-hover p-6 rounded-2xl border-2 border-transparent hover:border-blue-500/50 flex items-center gap-6 group"
                        >
                            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                <span className="text-3xl">📦</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground group-hover:text-blue-400 transition-colors">Inventory</h3>
                                <p className="text-sm text-muted-foreground">Analyze and manage items</p>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/settings"
                            className="glass-card card-hover p-6 rounded-2xl border-2 border-transparent hover:border-gray-500/50 flex items-center gap-6 group"
                        >
                            <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform">
                                <span className="text-3xl">⚙️</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground group-hover:text-gray-400 transition-colors">Settings</h3>
                                <p className="text-sm text-muted-foreground">System configurations</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Onboarding Prompt (if new user) */}
                {!user?.setupCompleted && (
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">🎉 Welcome to AI Retail System!</h2>
                                <p className="text-purple-100 mb-4">
                                    Let's customize your inventory fields to match your business needs
                                </p>
                                <Link
                                    href="/dashboard/onboarding"
                                    className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                                >
                                    Start Setup Wizard →
                                </Link>
                            </div>
                            <button className="text-purple-200 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Getting Started Guide */}
                {user?.setupCompleted && stats.totalProducts === 0 && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Started</h2>
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 block">🚀</span>
                            <p className="text-gray-900 font-semibold mb-2">Ready to start managing your inventory?</p>
                            <p className="text-gray-600 mb-4">Add your first product to see your dashboard come to life!</p>
                            <Link
                                href="/dashboard/inventory/add"
                                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                            >
                                Add Your First Product
                            </Link>
                        </div>
                    </div>
                )}

                {/* Recent Activity (when products exist) */}
                {user?.setupCompleted && stats.totalProducts > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory Overview</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <span className="text-xl">📦</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Total Products</p>
                                        <p className="text-sm text-gray-600">{stats.totalProducts} items in inventory</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/inventory"
                                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                                >
                                    View All →
                                </Link>
                            </div>

                            {stats.lowStockCount > 0 && (
                                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-lg">
                                            <span className="text-xl">⚠️</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-orange-900">Low Stock Alert</p>
                                            <p className="text-sm text-orange-700">{stats.lowStockCount} items need restocking</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard/inventory"
                                        className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                                    >
                                        Review →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
