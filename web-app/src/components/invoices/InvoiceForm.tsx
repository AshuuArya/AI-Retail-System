'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    CreditCard,
    ShoppingCart,
    Plus,
    Trash2,
    Check,
    AlertCircle,
    Search,
    Type,
    Wallet,
    Smartphone,
    FileText
} from 'lucide-react';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface Product {
    id: string;
    itemName: string;
    sellPrice: number;
    quantity: number;
    unit: string;
}

interface InvoiceItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

export default function InvoiceForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');

    useEffect(() => {
        if (user?.$id) {
            fetchCustomers();
            fetchProducts();
        }
    }, [user?.$id]);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`/api/customers?sellerId=${user?.$id}`);
            const data = await response.json();
            if (response.ok) setCustomers(data.customers || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`/api/products?sellerId=${user?.$id}`);
            const data = await response.json();
            if (response.ok) setProducts(data.products || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addItem = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = items.find(item => item.productId === productId);
        if (existingItem) {
            updateItemQuantity(productId, existingItem.quantity + 1);
        } else {
            setItems([...items, {
                productId: product.id,
                productName: product.itemName,
                quantity: 1,
                price: product.sellPrice,
                total: product.sellPrice
            }]);
        }
    };

    const updateItemQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems(items.map(item =>
            item.productId === productId
                ? { ...item, quantity, total: item.price * quantity }
                : item
        ));
    };

    const removeItem = (productId: string) => {
        setItems(items.filter(item => item.productId !== productId));
    };

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!selectedCustomerId || items.length === 0) {
            setError('Please select a customer and add items');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sellerId: user?.$id,
                    customerId: selectedCustomerId,
                    items,
                    subtotal,
                    discount: discountAmount,
                    total,
                    paymentMethod,
                    notes,
                    status: 'paid',
                }),
            });

            if (!response.ok) throw new Error('Invoice generation failed');
            router.push('/dashboard/invoices');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
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
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Customer Selection */}
                <Card className="border-white/5" padding="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <User size={18} />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">1. Customer Selection</h3>
                    </div>
                    <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Billed To</label>
                        <div className="relative">
                            <select
                                value={selectedCustomerId}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCustomerId(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 focus:border-blue-500/50 outline-none transition-all appearance-none h-[46px]"
                                required
                            >
                                <option value="" className="bg-slate-900 font-sans">Search for a customer...</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id} className="bg-slate-900 font-sans">{c.name} ({c.phone})</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <Search size={16} />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 2. Payment Method */}
                <Card className="border-white/10" padding="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <CreditCard size={18} />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">2. Payment Method</h3>
                    </div>
                    <div className="flex gap-3">
                        {[
                            { id: 'cash', icon: Wallet, label: 'Cash' },
                            { id: 'card', icon: CreditCard, label: 'Card' },
                            { id: 'upi', icon: Smartphone, label: 'UPI' }
                        ].map(method => (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => setPaymentMethod(method.id as any)}
                                className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${paymentMethod === method.id
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                <method.icon size={20} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* 3. Items Selection */}
            <Card className="border-white/5 overflow-hidden" padding="p-0">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <ShoppingCart size={18} />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">3. Invoice Items</h3>
                    </div>

                    <div className="md:w-72 relative">
                        <select
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { addItem(e.target.value); e.target.value = ''; }}
                            className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:border-blue-500/50 outline-none transition-all appearance-none"
                        >
                            <option value="" className="bg-slate-900">Add from catalog...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id} className="bg-slate-900">{p.itemName} - ₹{p.sellPrice}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <Plus size={14} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/10">
                                <th className="text-left px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product</th>
                                <th className="text-center px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quantity</th>
                                <th className="text-right px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
                                <th className="text-right px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</th>
                                <th className="w-20 px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500 italic text-sm">
                                        No items added to invoice yet.
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.productId} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-white text-sm">{item.productName}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all border border-white/10"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-bold text-white w-6 text-center">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all border border-white/10"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right font-medium text-slate-400 text-sm">₹{item.price.toFixed(2)}</td>
                                        <td className="px-8 py-5 text-right font-bold text-white text-sm">₹{item.total.toFixed(2)}</td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.productId)}
                                                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Notes */}
                <div className="lg:col-span-2">
                    <Card className="border-white/5 h-full" padding="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                <FileText size={18} />
                            </div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Internal Ledger Notes</h3>
                        </div>
                        <TextArea
                            label=""
                            className="min-h-[120px]"
                            value={notes}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                            placeholder="Public or private transaction notes..."
                        />
                    </Card>
                </div>

                {/* Totals */}
                <Card className="border-white/10 bg-white/[0.02]" padding="p-6">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="text-slate-300 font-bold">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium text-slate-500 uppercase tracking-widest">
                                <span>Discount (%)</span>
                                <div className="w-20">
                                    <Input
                                        type="number"
                                        className="h-9 px-3 text-center"
                                        value={discount}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscount(parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Grand Total</span>
                                <span className="text-3xl font-bold text-white tracking-tighter">₹{total.toFixed(2)}</span>
                            </div>
                            <Button
                                type="submit"
                                disabled={loading || items.length === 0}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-500 border-0 shadow-lg shadow-blue-600/20 rounded-2xl font-bold text-sm"
                                isLoading={loading}
                            >
                                <Check size={20} className="mr-2" />
                                {loading ? 'Processing...' : 'Generate Invoice'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </form>
    );
}
