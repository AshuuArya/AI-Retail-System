'use client';

import React from 'react';
import ProductForm from '@/components/inventory/ProductForm';
import { useAuth } from '@/contexts/AuthContext';

export default function AddProductPage() {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Product</h1>
                    <p className="text-gray-600 dark:text-gray-400">Fill in the details to add a product to your inventory</p>
                </div>

                <ProductForm />
            </div>
        </div>
    );
}
