'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AIAutoFill from '@/components/ai/AIAutoFill';
import { Card } from '@/components/ui/Card';
import { Input, TextArea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Info,
    Zap,
    Tag,
    DollarSign,
    Box,
    Hash,
    BarChart,
    Check,
    AlertCircle
} from 'lucide-react';

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
    isEdit?: boolean;
}

export default function ProductForm({ initialData, productId, onSuccess, isEdit }: ProductFormProps) {
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
        setTimeout(() => setAiGenerated(false), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = productId ? `/api/products/${productId}` : '/api/products';
            const method = productId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    itemId: formData.sku || `ITEM-${Date.now()}`,
                    sellerId: user?.$id,
                    isActive: true,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save product');
            }

            if (onSuccess) onSuccess();
            else router.push('/dashboard/inventory');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium"
                    >
                        <AlertCircle size={18} />
                        {error}
                    </motion.div>
                )}

                {aiGenerated && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 text-blue-400 text-sm font-bold shadow-lg"
                    >
                        <Zap size={18} className="animate-pulse" />
                        ✨ Form filled with AI suggestions. Please review before saving.
                    </motion.div>
                )}
            </AnimatePresence>

            {!isEdit && (
                <Card className="!p-6 border-blue-500/20 bg-blue-500/[0.02]" hover={false}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Zap size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest">AI Assistant</h4>
                    </div>
                    <AIAutoFill
                        productName={formData.itemName}
                        onDataGenerated={handleAIData}
                    />
                </Card>
            )}

            {/* Basic Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 ml-1">
                    <Info size={16} className="text-slate-500" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">General Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <Input
                            label="Product Name *"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            required
                            placeholder="e.g., iPhone 15 Pro Max"
                            icon={<Tag size={16} />}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <TextArea
                            label="Description"
                            name="userEditedDescription"
                            value={formData.userEditedDescription}
                            onChange={handleChange}
                            placeholder="Describe your product features and details..."
                        />
                    </div>
                    <Input
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g., Electronics"
                    />
                    <Input
                        label="Brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="e.g., Apple"
                    />
                </div>
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3 ml-1">
                    <BarChart size={16} className="text-slate-500" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pricing & Stock</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                        label="Selling Price (₹) *"
                        type="number"
                        name="sellPrice"
                        value={formData.sellPrice}
                        onChange={handleChange}
                        required
                        icon={<DollarSign size={16} />}
                    />
                    <Input
                        label="Cost Price (₹)"
                        type="number"
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleChange}
                        icon={<DollarSign size={16} />}
                    />
                    <Input
                        label="Opening Stock *"
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        icon={<Box size={16} />}
                    />
                    <Input
                        label="Low Stock Threshold"
                        type="number"
                        name="lowStockThreshold"
                        value={formData.lowStockThreshold}
                        onChange={handleChange}
                    />
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Unit</label>
                        <select
                            name="unit"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:border-blue-500/50 outline-none transition-all h-[46px]"
                            value={formData.unit}
                            onChange={handleChange}
                        >
                            <option value="piece">Unit / Piece</option>
                            <option value="kg">Kilogram (KG)</option>
                            <option value="l">Liter (L)</option>
                            <option value="pack">Pack</option>
                            <option value="box">Box</option>
                        </select>
                    </div>
                    <Input
                        label="SKU / Item code"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="ITEM-001"
                        icon={<Hash size={16} />}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/5">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="px-6"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="h-12 px-10 bg-blue-600 hover:bg-blue-500 border-0 shadow-lg shadow-blue-600/20"
                    isLoading={loading}
                >
                    <Check size={18} className="mr-2" />
                    {isEdit ? 'Save Changes' : 'Add Product'}
                </Button>
            </div>
        </form>
    );
}
