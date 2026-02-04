'use client';

import React from 'react';

interface TopProduct {
    id: string;
    name: string;
    quantity: number;
    revenue: number;
}

interface TopProductsProps {
    products: TopProduct[];
}

export default function TopProducts({ products }: TopProductsProps) {
    const maxRevenue = Math.max(...products.map(p => p.revenue), 1);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h3>

            {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No product sales yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {products.map((product, index) => {
                        const percentage = (product.revenue / maxRevenue) * 100;

                        return (
                            <div key={product.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">₹{product.revenue.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.quantity} sold</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
