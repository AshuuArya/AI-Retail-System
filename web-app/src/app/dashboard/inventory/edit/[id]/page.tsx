'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductForm from '@/components/inventory/ProductForm';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, Box, Loader2, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={40} className="text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Product Data...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="max-w-md w-full border-white/5" padding="p-8">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Fetch Error</h2>
                        <p className="text-slate-400 text-sm mb-8">
                            {error || 'The requested product could not be located in the database.'}
                        </p>
                        <Button
                            onClick={() => router.push('/dashboard/inventory')}
                            className="w-full bg-blue-600 hover:bg-blue-500"
                        >
                            Return to Inventory
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-12">
            {/* Breadcrumb / Back */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Link href="/dashboard/inventory">
                    <Button variant="ghost" size="sm" className="group">
                        <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Inventory
                    </Button>
                </Link>
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 border-b border-white/10 pb-8"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                        <Box size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Inventory Management</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Edit Product
                </h1>
                <p className="text-sm text-slate-400">
                    Update current <span className="text-white font-semibold">product specifications</span> and inventory levels.
                </p>
            </motion.div>

            <Card className="border-white/5 overflow-hidden" padding="p-8">
                <ProductForm initialData={product} productId={productId} isEdit={true} onSuccess={handleSuccess} />
            </Card>
        </div>
    );
}
