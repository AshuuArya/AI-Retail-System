'use client';

import React from 'react';
import CustomerForm from '@/components/customers/CustomerForm';

export default function AddCustomerPage() {
    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Customer</h1>
                    <p className="text-gray-600 dark:text-gray-400">Add a new customer to your database</p>
                </div>

                <CustomerForm />
            </div>
        </div>
    );
}
