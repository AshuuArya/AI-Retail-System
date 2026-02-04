'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Customer {
    $id: string;
    name: string;
    email: string;
    phone: string;
}

interface Product {
    $id: string;
    name: string;
    price: number;
    stock: number;
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

    // Data
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // Form state
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`/api/customers?sellerId=${user?.$id}`);
            const data = await response.json();
            if (response.ok) {
                setCustomers(data.customers || []);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`/api/products?sellerId=${user?.$id}`);
            const data = await response.json();
            if (response.ok) {
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addItem = (productId: string) => {
        const product = products.find(p => p.$id === productId);
        if (!product) return;

        const existingItem = items.find(item => item.productId === productId);
        if (existingItem) {
            updateItemQuantity(productId, existingItem.quantity + 1);
        } else {
            setItems([...items, {
                productId: product.$id,
                productName: product.name,
                quantity: 1,
                price: product.price,
                total: product.price
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

        if (!selectedCustomerId) {
            setError('Please select a customer');
            setLoading(false);
            return;
        }

        if (items.length === 0) {
            setError('Please add at least one product');
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
                    items: items.map(item => ({
                        productId: item.productId,
                        productName: item.productName,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total
                    })),
                    subtotal,
                    discount: discountAmount,
                    total,
                    paymentMethod,
                    notes,
                    status: 'paid',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create invoice');
            }

            router.push('/dashboard/invoices');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Customer Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">1. Select Customer</h3>
                <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                    <option value="">Choose a customer...</option>
                    {customers.map(customer => (
                        <option key={customer.$id} value={customer.$id}>
                            {customer.name} - {customer.phone}
                        </option>
                    ))}
                </select>
            </div>

            {/* Product Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">2. Add Products</h3>
                <select
                    onChange={(e) => {
                        addItem(e.target.value);
                        e.target.value = '';
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                >
                    <option value="">Select product to add...</option>
                    {products.map(product => (
                        <option key={product.$id} value={product.$id}>
                            {product.name} - ₹{product.price} (Stock: {product.stock})
                        </option>
                    ))}
                </select>

                {/* Items List */}
                {items.length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((item) => (
                                    <tr key={item.productId}>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">₹{item.price}</td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value) || 0)}
                                                className="w-20 px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{item.total.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.productId)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Totals & Payment */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">3. Payment Details</h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-lg font-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="text-gray-600">Discount (%):</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={discount}
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                            className="w-24 px-3 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg"
                        />
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                            <span>Discount Amount:</span>
                            <span>-₹{discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="text-xl font-bold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-purple-600">₹{total.toFixed(2)}</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                        <div className="flex gap-4">
                            {(['cash', 'card', 'upi'] as const).map(method => (
                                <label key={method} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                                        className="mr-2"
                                    />
                                    <span className="capitalize">{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Add any additional notes..."
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Invoice'}
                </button>
            </div>
        </form>
    );
}
