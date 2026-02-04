'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AIAutoFill from '@/components/ai/AIAutoFill';
import { useDebouncedCallback } from '@/hooks/useOptimization';

interface ProductFormData {
    itemName: string;
    userEditedDescription: string;
    category: string;
    sellPrice: number;
    costPrice: number;
    quantity: number;
    lowStockThreshold: number;
    barcode: string;
    sku: string;
    unit: string;
    brand: string;
    tags: string[];
}

interface ProductFormProps {
    initialData?: Partial<ProductFormData>;
    productId?: string;
    onSuccess?: () => void;
}

export default function ProductForm({ initialData, productId, onSuccess }: ProductFormProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [aiGenerated, setAiGenerated] = useState(false);

    const [formData, setFormData] = useState<ProductFormData>({
        itemName: initialData?.itemName || '',
        userEditedDescription: initialData?.userEditedDescription || '',
        category: initialData?.category || '',
        sellPrice: initialData?.sellPrice || 0,
        costPrice: initialData?.costPrice || 0,
        quantity: initialData?.quantity || 0,
        lowStockThreshold: initialData?.lowStockThreshold || 10,
        barcode: initialData?.barcode || '',
        sku: initialData?.sku || '',
        unit: initialData?.unit || 'piece',
        brand: initialData?.brand || '',
        tags: initialData?.tags || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['sellPrice', 'costPrice', 'quantity', 'lowStockThreshold'].includes(name)
                ? parseFloat(value) || 0
                : value
        }));
    };

    // Handle AI auto-fill data
    const handleAIData = (aiData: any) => {
        setFormData(prev => ({
            ...prev,
            itemName: aiData.name || prev.itemName,
            userEditedDescription: aiData.description || prev.userEditedDescription,
            category: aiData.category || prev.category,
            brand: aiData.brand || prev.brand,
            sellPrice: aiData.suggestedPrice || prev.sellPrice,
            costPrice: aiData.estimatedCostPrice || prev.costPrice,
            tags: aiData.tags || prev.tags,
            unit: aiData.unit || prev.unit,
            lowStockThreshold: aiData.lowStockThreshold || prev.lowStockThreshold,
            sku: aiData.sku || prev.sku,
        }));
        setAiGenerated(true);

        // Show success message
        setTimeout(() => setAiGenerated(false), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = productId
                ? `/api/products/${productId}`
                : '/api/products';

            const method = productId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    itemId: formData.sku || `ITEM-${Date.now()}`,
                    sellerId: user?.$id,
                    isActive: true,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `Failed to ${productId ? 'update' : 'create'} product`);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/dashboard/inventory');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <p className="font-semibold">{error}</p>
                </div>
            )}

            {aiGenerated && (
                <div className="bg-primary/10 border border-primary/20 text-primary px-6 py-4 rounded-2xl flex items-center gap-3 animate-float">
                    <span className="text-2xl">✨</span>
                    <span className="font-extrabold uppercase tracking-widest text-xs">AI Assistant: Details Updated</span>
                </div>
            )}

            {/* AI AUTO-FILL - Manual Trigger Only */}
            {!productId && (
                <AIAutoFill
                    productName={formData.itemName}
                    onDataGenerated={handleAIData}
                />
            )}

            {/* Basic Information */}
            <div className="glass-card rounded-2xl p-8 border-l-4 border-l-primary shadow-2xl">
                <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">📝</div>
                    Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            required
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 text-foreground transition-all placeholder:text-muted-foreground/50"
                            placeholder="e.g., iPhone 15 Pro"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3 flex items-center justify-between">
                            <span>Product Description</span>
                            {formData.userEditedDescription && <span className="text-[10px] text-primary px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">AI HELPED</span>}
                        </label>
                        <textarea
                            name="userEditedDescription"
                            value={formData.userEditedDescription}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 text-foreground transition-all placeholder:text-muted-foreground/50"
                            placeholder="Detailed technical specifications..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3 flex items-center justify-between">
                            <span>Category</span>
                            {formData.category && <span className="text-[10px] text-primary">SUGGESTED</span>}
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 text-foreground"
                            placeholder="e.g., Electronics"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
                            Manufacturer/Brand
                        </label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 text-foreground"
                            placeholder="e.g., Apple"
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Stock */}
            <div className="glass-card rounded-2xl p-8 border-l-4 border-l-green-500 shadow-2xl">
                <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-xl text-green-500">💰</div>
                    Pricing & Stock
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
                            Selling Price (₹) *
                        </label>
                        <input
                            type="number"
                            name="sellPrice"
                            value={formData.sellPrice}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-green-500/50 text-foreground font-bold text-lg"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
                            Cost Price (₹)
                        </label>
                        <input
                            type="number"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-green-500/50 text-foreground"
                            placeholder="0.00"
                        />
                        {formData.sellPrice > 0 && formData.costPrice > 0 && (
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Est. Margin</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${(((formData.sellPrice - formData.costPrice) / formData.sellPrice) * 100) > 20 ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                    {(((formData.sellPrice - formData.costPrice) / formData.sellPrice) * 100).toFixed(1)}%
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
                            Current Stock *
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-green-500/50 text-foreground"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3 flex items-center justify-between">
                            <span>Low Stock Alert</span>
                            <span className="text-[10px] text-orange-500">AUTO-MONITORED</span>
                        </label>
                        <input
                            type="number"
                            name="lowStockThreshold"
                            value={formData.lowStockThreshold}
                            onChange={handleChange}
                            min="0"
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-orange-500/50 text-foreground"
                            placeholder="10"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
                            Unit
                        </label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-primary/50 text-foreground appearance-none"
                        >
                            <option value="piece" className="bg-card">Piece</option>
                            <option value="kg" className="bg-card">Kilogram</option>
                            <option value="g" className="bg-card">Gram</option>
                            <option value="l" className="bg-card">Liter</option>
                            <option value="ml" className="bg-card">Milliliter</option>
                            <option value="box" className="bg-card">Box</option>
                            <option value="pack" className="bg-card">Pack</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tracking Hardware */}
            <div className="glass-card rounded-2xl p-8 border-l-4 border-l-blue-500 shadow-2xl">
                <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-xl text-blue-500">🏷️</div>
                    Identification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">
                            Barcode (UPC/EAN)
                        </label>
                        <input
                            type="text"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/50 text-foreground"
                            placeholder="Scan or input code..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3 flex items-center justify-between">
                            <span>SKU (Code)</span>
                            {formData.sku && <span className="text-[10px] text-blue-500">UNIQUE CODE</span>}
                        </label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            className="w-full h-12 bg-white/5 border border-border/50 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/50 text-foreground"
                            placeholder="Unique identifier..."
                        />
                    </div>

                    {formData.tags && formData.tags.length > 0 && (
                        <div className="md:col-span-2">
                            <label className="block text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-4"> Tags </label>
                            <div className="flex flex-wrap gap-3">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-1.5 bg-white/5 border border-border/50 text-foreground text-[10px] font-extrabold uppercase tracking-widest rounded-xl hover:bg-primary/20 hover:border-primary/30 transition-all cursor-default"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-6 pt-12">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="h-14 px-10 bg-secondary border border-border/50 text-foreground font-bold rounded-2xl hover:bg-muted transition-all active:scale-95"
                >
                    CANCEL
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="h-14 px-12 premium-gradient text-white font-extrabold rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </div>
                    ) : productId ? 'Save Changes' : 'Add Product'}
                </button>
            </div>
        </form>
    );
}
