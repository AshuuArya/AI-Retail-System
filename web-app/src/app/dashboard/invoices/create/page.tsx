'use client';

import React from 'react';
import InvoiceForm from '@/components/invoices/InvoiceForm';

export default function CreateInvoicePage() {
    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Invoice</h1>
                    <p className="text-gray-600 dark:text-gray-400">Generate an invoice for a customer</p>
                </div>

                <InvoiceForm />
            </div>
        </div>
    );
}
