'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { exportProductsToCSV } from '@/lib/exportUtils';
import BarcodeScanner from '@/components/mobile/BarcodeScanner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FilterPanel, { FilterGroup } from '@/components/ui/FilterPanel';
import { useDebounce } from '@/hooks/useOptimization';

interface Product {
    id: string;
    createdAt: string;
    itemName: string;
    sku?: string;
    barcode?: string;
    category?: string;
    brand?: string;
    userEditedDescription?: string;
    sellPrice: number;
    costPrice?: number;
    quantity: number;
    unit: string;
    lowStockThreshold: number;
    tags?: string[];
    isActive: boolean;
}

export default function InventoryPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; productId: string; productName: string }>({
        isOpen: false,
        productId: '',
        productName: ''
    });
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

    // Filter state
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        priceMin: '',
        priceMax: '',
        stockStatus: 'all' as 'all' | 'low' | 'out' | 'in',
        sortBy: 'name' as 'name' | 'price' | 'stock' | 'date',
        sortOrder: 'asc' as 'asc' | 'desc'
    });

    // Debounce search term for smoother UX
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user]);

    // Get unique categories and brands for filter dropdowns
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

    // Filter and sort products
    const filteredProducts = products
        .filter(product => {
            // Search filter
            const searchLower = debouncedSearchTerm.toLowerCase();
            const matchesSearch = !debouncedSearchTerm ||
                product.itemName.toLowerCase().includes(searchLower) ||
                product.sku?.toLowerCase().includes(searchLower) ||
                product.barcode?.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower) ||
                product.brand?.toLowerCase().includes(searchLower);

            // Category filter
            const matchesCategory = !filters.category || product.category === filters.category;

            // Brand filter
            const matchesBrand = !filters.brand || product.brand === filters.brand;

            // Price filter
            const matchesPriceMin = !filters.priceMin || product.sellPrice >= parseFloat(filters.priceMin);
            const matchesPriceMax = !filters.priceMax || product.sellPrice <= parseFloat(filters.priceMax);

            // Stock status filter
            let matchesStockStatus = true;
            if (filters.stockStatus === 'low') {
                matchesStockStatus = product.quantity <= product.lowStockThreshold && product.quantity > 0;
            } else if (filters.stockStatus === 'out') {
                matchesStockStatus = product.quantity === 0;
            } else if (filters.stockStatus === 'in') {
                matchesStockStatus = product.quantity > product.lowStockThreshold;
            }

            return matchesSearch && matchesCategory && matchesBrand &&
                matchesPriceMin && matchesPriceMax && matchesStockStatus;
        })
        .sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'name':
                    comparison = a.itemName.localeCompare(b.itemName);
                    break;
                case 'price':
                    comparison = a.sellPrice - b.sellPrice;
                    break;
                case 'stock':
                    comparison = a.quantity - b.quantity;
                    break;
                case 'date':
                    comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    break;
            }

            return filters.sortOrder === 'asc' ? comparison : -comparison;
        });
    // Auto-fetch when debounced search or category changes
    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [debouncedSearchTerm, selectedCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                sellerId: user?.$id || ''
            });

            if (selectedCategory) {
                params.append('category', selectedCategory);
            }

            if (debouncedSearchTerm) {
                params.append('search', debouncedSearchTerm);
            }

            const response = await fetch(`/api/products?${params}`);
            const data = await response.json();

            if (response.ok) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold);
    const totalValue = products.reduce((sum, p) => sum + (p.sellPrice * p.quantity), 0);

    const handleBarcodeScan = (barcode: string) => {
        // Search for product by barcode
        setSearchTerm(barcode);
        setShowScanner(false);
    };

    const handleDeleteClick = (productId: string, productName: string) => {
        setDeleteDialog({
            isOpen: true,
            productId,
            productName
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/products/${deleteDialog.productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove product from list
                setProducts(products.filter(p => p.id !== deleteDialog.productId));
                setDeleteDialog({ isOpen: false, productId: '', productName: '' });
            } else {
                const data = await response.json();
                alert(`Failed to delete product: ${data.error}`);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ isOpen: false, productId: '', productName: '' });
    };

    const toggleProductSelection = (productId: string) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedProducts(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedProducts.size === products.length) {
            setSelectedProducts(new Set());
        } else {
            setSelectedProducts(new Set(products.map(p => p.id)));
        }
    };

    const handleBulkDelete = async () => {
        try {
            const deletePromises = Array.from(selectedProducts).map(productId =>
                fetch(`/api/products/${productId}`, { method: 'DELETE' })
            );

            await Promise.all(deletePromises);

            // Remove deleted products from list
            setProducts(products.filter(p => !selectedProducts.has(p.id)));
            setSelectedProducts(new Set());
            setBulkDeleteDialog(false);
        } catch (error) {
            console.error('Error bulk deleting products:', error);
            alert('Failed to delete some products');
        }
    };

    // Filter handlers
    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearAllFilters = () => {
        setFilters({
            category: '',
            brand: '',
            priceMin: '',
            priceMax: '',
            stockStatus: 'all',
            sortBy: 'name',
            sortOrder: 'asc'
        });
    };

    const activeFilterCount = [
        filters.category,
        filters.brand,
        filters.priceMin,
        filters.priceMax,
        filters.stockStatus !== 'all' ? filters.stockStatus : null
    ].filter(Boolean).length;

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                        Inventory <span className="text-primary">Management</span>
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg">Tracks and manages your products and stock levels.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-primary/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Products</p>
                                <p className="text-3xl font-bold text-foreground mt-2">{products.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                <span className="text-2xl">📦</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-orange-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Alerts</p>
                                <p className="text-3xl font-bold text-orange-500 mt-2">{lowStockProducts.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                                <span className="text-2xl text-glow">⚠️</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-green-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Inventory Value</p>
                                <p className="text-3xl font-bold text-green-500 mt-2">₹{totalValue.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card card-hover rounded-2xl p-6 border-l-4 border-l-blue-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categories</p>
                                <p className="text-3xl font-bold text-blue-500 mt-2">
                                    {new Set(products.map(p => p.category).filter(Boolean)).size}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Actions */}
                <div className="glass-card rounded-2xl p-6 border-b-border/30 mb-8">
                    <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
                        <div className="flex-1 w-full relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-12 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
                            {searchTerm && searchTerm !== debouncedSearchTerm && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 w-full xl:w-auto items-center justify-end">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`h-12 px-6 rounded-xl font-bold transition-all flex items-center gap-3 border shadow-lg ${showFilters || activeFilterCount > 0
                                    ? 'bg-primary border-primary text-white shadow-primary/20'
                                    : 'bg-secondary border-border/50 text-foreground hover:bg-muted'
                                    }`}
                            >
                                <span>⚡</span>
                                <span>Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="w-5 h-5 bg-white text-primary text-[10px] flex items-center justify-center rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            {selectedProducts.size > 0 && (
                                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
                                    <span className="text-sm font-bold text-red-500 px-2">{selectedProducts.size} SELECTED</span>
                                    <button
                                        onClick={() => setBulkDeleteDialog(true)}
                                        className="h-8 px-4 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                                    >
                                        TERMINATE
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => exportProductsToCSV(products)}
                                disabled={products.length === 0}
                                className="h-12 px-6 bg-secondary border border-border/50 text-foreground font-bold rounded-xl hover:bg-muted transition-all flex items-center gap-3 disabled:opacity-50"
                            >
                                <span>📥</span>
                                <span>Export</span>
                            </button>

                            <Link
                                href="/dashboard/inventory/add"
                                className="h-12 px-8 premium-gradient text-white font-extrabold rounded-xl shadow-lg shadow-purple-500/30 hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <span>+</span>
                                <span>Add Product</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filter Panel */}
                <FilterPanel
                    isOpen={showFilters}
                    onClose={() => setShowFilters(false)}
                    activeFilterCount={activeFilterCount}
                    onClearAll={clearAllFilters}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FilterGroup label="Category">
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full h-11 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 text-foreground"
                            >
                                <option value="" className="bg-card">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-card">{cat}</option>
                                ))}
                            </select>
                        </FilterGroup>

                        <FilterGroup label="Brand">
                            <select
                                value={filters.brand}
                                onChange={(e) => handleFilterChange('brand', e.target.value)}
                                className="w-full h-11 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 text-foreground"
                            >
                                <option value="" className="bg-card">All Brands</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand} className="bg-card">{brand}</option>
                                ))}
                            </select>
                        </FilterGroup>

                        <FilterGroup label="Stock Status">
                            <select
                                value={filters.stockStatus}
                                onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                                className="w-full h-11 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 text-foreground"
                            >
                                <option value="all" className="bg-card">All Level</option>
                                <option value="in" className="bg-card text-green-500">In Stock</option>
                                <option value="low" className="bg-card text-orange-500">Low Stock</option>
                                <option value="out" className="bg-card text-red-500">Out of Stock</option>
                            </select>
                        </FilterGroup>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <FilterGroup label="Price Range">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">MIN</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={filters.priceMin}
                                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                                        className="w-full h-11 bg-white/5 border border-border/50 rounded-xl pl-12 focus:ring-2 focus:ring-primary/50 text-foreground"
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">MAX</span>
                                    <input
                                        type="number"
                                        placeholder="Any"
                                        value={filters.priceMax}
                                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                                        className="w-full h-11 bg-white/5 border border-border/50 rounded-xl pl-12 focus:ring-2 focus:ring-primary/50 text-foreground"
                                    />
                                </div>
                            </div>
                        </FilterGroup>

                        <FilterGroup label="Ordering">
                            <div className="flex gap-4">
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="flex-1 h-11 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 text-foreground"
                                >
                                    <option value="name" className="bg-card">Alphabetical</option>
                                    <option value="price" className="bg-card">Price Tier</option>
                                    <option value="stock" className="bg-card">Quantity</option>
                                    <option value="date" className="bg-card">Chronological</option>
                                </select>
                                <button
                                    onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="w-11 h-11 bg-secondary border border-border/50 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
                                >
                                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </FilterGroup>
                    </div>
                </FilterPanel>

                {/* Products List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Start by adding your first product to the inventory</p>
                        <Link
                            href="/dashboard/inventory/add"
                            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Add Your First Product
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Select All Checkbox */}
                        {products.length > 0 && (
                            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 p-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.size === products.length && products.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Select All ({products.length} products)
                                    </span>
                                </label>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <div key={product.id} className="glass-card card-hover rounded-2xl p-6 relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 transform translate-x-2 -translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="w-12 h-12 premium-gradient flex items-center justify-center rounded-2xl text-xl shadow-lg rotate-12">📦</div>
                                    </div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="relative mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.has(product.id)}
                                                    onChange={() => toggleProductSelection(product.id)}
                                                    className="w-5 h-5 text-primary bg-white/10 border-border/50 rounded focus:ring-primary/50 cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{product.itemName}</h3>
                                                {product.category && (
                                                    <span className="inline-flex items-center px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                                                        {product.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {product.quantity <= product.lowStockThreshold && (
                                            <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center rounded-xl shadow-sm text-glow">
                                                ⚠️
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="p-3 bg-white/5 rounded-xl border border-border/30">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Price</p>
                                            <p className="text-lg font-extrabold text-foreground">₹{product.sellPrice.toLocaleString()}</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl border border-border/30">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Stock</p>
                                            <p className={`text-lg font-extrabold ${product.quantity <= product.lowStockThreshold ? 'text-orange-500' : 'text-green-500'}`}>
                                                {product.quantity} <span className="text-xs font-medium text-muted-foreground">{product.unit}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Link
                                            href={`/dashboard/inventory/edit/${product.id}`}
                                            className="flex-1 h-12 bg-secondary border border-border/50 text-foreground rounded-xl flex items-center justify-center font-bold hover:bg-muted transition-all text-sm"
                                        >
                                            EDIT
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(product.id, product.itemName)}
                                            className="flex-1 h-12 bg-red-500 border border-red-600/20 text-white rounded-xl font-bold hover:bg-red-600 transition-all text-sm shadow-lg shadow-red-500/10"
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Barcode Scanner Modal */}
                {showScanner && (
                    <BarcodeScanner
                        onScan={handleBarcodeScan}
                        onClose={() => setShowScanner(false)}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={deleteDialog.isOpen}
                    title="Delete Product"
                    message={`Are you sure you want to delete "${deleteDialog.productName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />

                {/* Bulk Delete Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={bulkDeleteDialog}
                    title="Delete Multiple Products"
                    message={`Are you sure you want to delete ${selectedProducts.size} selected product(s)? This action cannot be undone.`}
                    confirmText="Delete All"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={handleBulkDelete}
                    onCancel={() => setBulkDeleteDialog(false)}
                />
            </div>
        </div>
    );
}
