'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { exportProductsToCSV } from '@/lib/exportUtils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Search,
    Filter,
    Download,
    Plus,
    Edit3,
    Trash2,
    ChevronRight,
    Box,
    Layers,
    Activity
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useDebounce } from '@/hooks/useOptimization';

interface Product {
    id: string;
    itemName: string;
    category: string;
    sellPrice: number;
    quantity: number;
    lowStockThreshold: number;
    unit: string;
}

export default function InventoryPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; productId: string; productName: string }>({
        isOpen: false,
        productId: '',
        productName: ''
    });

    const [filters, setFilters] = useState({
        category: '',
        stockStatus: 'all' as 'all' | 'low' | 'out',
    });

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (user?.$id) fetchProducts();
    }, [user, debouncedSearchTerm, filters.category, filters.stockStatus]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ sellerId: user?.$id || '' });
            if (filters.category) params.append('category', filters.category);
            if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);

            const response = await fetch(`/api/products?${params}`);
            const data = await response.json();

            if (response.ok && data.products) {
                let filtered = data.products;
                if (filters.stockStatus === 'low') {
                    filtered = filtered.filter((p: any) => p.quantity <= (p.lowStockThreshold || 10) && p.quantity > 0);
                } else if (filters.stockStatus === 'out') {
                    filtered = filtered.filter((p: any) => p.quantity === 0);
                }
                setProducts(filtered);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (productId: string, productName: string) => {
        setDeleteDialog({ isOpen: true, productId, productName });
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/products/${deleteDialog.productId}`, { method: 'DELETE' });
            if (response.ok) {
                setProducts(products.filter(p => p.id !== deleteDialog.productId));
                setDeleteDialog({ isOpen: false, productId: '', productName: '' });
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

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
                        <Package size={16} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Inventory Management</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Product List
                    </h1>
                    <p className="text-sm text-slate-400">
                        View and manage your <span className="text-white font-semibold">store inventory</span>, stock levels, and pricing.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={() => exportProductsToCSV(products)} className="h-10 px-4 rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                        <Download size={16} className="mr-2" />
                        Export CSV
                    </Button>
                    <Link href="/dashboard/inventory/add">
                        <Button className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 border-0 shadow-lg shadow-blue-600/20">
                            <Plus size={18} className="mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Filters */}
            <Card className="border-white/5" padding="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="md:col-span-2">
                        <Input
                            placeholder="Search by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            label="Search Products"
                            className="h-10 rounded-lg"
                            icon={<Search size={16} />}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Stock Status</label>
                        <select
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 focus:border-blue-500/50 outline-none transition-all h-10"
                            value={filters.stockStatus}
                            onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value as any })}
                        >
                            <option value="all">All Products</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                        </select>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearchTerm('');
                            setFilters({ category: '', stockStatus: 'all' });
                        }}
                        className="h-10 text-xs font-semibold hover:bg-white/5"
                    >
                        Reset Filters
                    </Button>
                </div>
            </Card>

            {/* Asset Table */}
            <Card className="border-white/5 overflow-hidden" padding="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Product Name</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5 text-right">Price</th>
                                <th className="px-8 py-5 text-center">In Stock</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {loading && products.length === 0 ? (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="inline-block w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                            <p className="mt-4 text-xs font-bold text-slate-500 tracking-widest uppercase">Loading Inventory...</p>
                                        </td>
                                    </motion.tr>
                                ) : (
                                    products.map((product, idx) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                        <Box size={16} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-200">{product.itemName}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge variant="neutral" className="bg-white/5 text-[10px] py-1">
                                                    {product.category || 'General'}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="text-xs font-bold text-white">₹{(product.sellPrice ?? 0).toLocaleString()}</div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${product.quantity <= (product.lowStockThreshold || 10) ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${Math.min((product.quantity / 100) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-[10px] font-bold ${product.quantity <= (product.lowStockThreshold || 10) ? 'text-orange-400' : 'text-slate-400'}`}>
                                                        {product.quantity} {product.unit || 'units'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/dashboard/inventory/edit/${product.id}`}>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-white/5">
                                                            <Edit3 size={14} className="text-slate-400" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(product.id, product.itemName)}
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
                title="Delete Product"
                message={`Are you sure you want to remove "${deleteDialog.productName}" from your inventory? This action cannot be undone.`}
            />
        </div>
    );
}
