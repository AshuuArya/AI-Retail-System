'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductForm from '@/components/inventory/ProductForm';
import { useAuth } from '@/contexts/AuthContext';

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const productId = params.id as string;

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        fetchProduct();
    }, [user, productId]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${productId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }

            const data = await response.json();
            setProduct(data);
        } catch (err: any) {
            console.error('Error fetching product:', err);
            setError(err.message || 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        router.push('/dashboard/inventory');
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {error || 'Product not found'}
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/inventory')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Back to Inventory
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                        Edit Product
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Update product information
                    </p>
                </div>

                <ProductForm
                    initialData={product}
                    productId={productId}
                    onSuccess={handleSuccess}
                />
            </div>
        </div>
    );
}
