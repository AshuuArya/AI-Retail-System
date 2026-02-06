'use client';

import React from 'react';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { ChevronLeft, FilePlus, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CreateInvoicePage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-12">
            {/* Breadcrumb / Back */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Link href="/dashboard/invoices">
                    <Button variant="ghost" size="sm" className="group">
                        <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Billing
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
                        <FilePlus size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Billing & Invoices</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Create New Invoice
                </h1>
                <p className="text-sm text-slate-400">
                    Generate a professional bill by selecting a <span className="text-white font-semibold">customer</span> and adding items from your catalog.
                </p>
            </motion.div>

            <InvoiceForm />
        </div>
    );
}
