'use client';

import React from 'react';
import ProductForm from '@/components/inventory/ProductForm';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, Box } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AddProductPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
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
                className="space-y-2 border-b border-white/10 pb-6"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                        <Box size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Inventory Management</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Add New Product
                </h1>
                <p className="text-sm text-slate-400">
                    Add a new item to your <span className="text-white font-semibold">store inventory</span> to start tracking stock and sales.
                </p>
            </motion.div>

            <Card className="border-white/5 overflow-hidden" padding="p-8">
                <ProductForm />
            </Card>
        </div>
    );
}
