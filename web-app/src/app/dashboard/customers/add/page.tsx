'use client';

import React from 'react';
import CustomerForm from '@/components/customers/CustomerForm';
import { ChevronLeft, Users, UserPlus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AddCustomerPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-12">
            {/* Breadcrumb / Back */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Link href="/dashboard/customers">
                    <Button variant="ghost" size="sm" className="group">
                        <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Directory
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
                        <UserPlus size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Customer Management</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Add New Customer
                </h1>
                <p className="text-sm text-slate-400">
                    Register a new customer profile to track their <span className="text-white font-semibold">purchase history</span> and preferences.
                </p>
            </motion.div>

            <Card className="border-white/5 overflow-hidden" padding="p-8">
                <CustomerForm />
            </Card>
        </div>
    );
}
