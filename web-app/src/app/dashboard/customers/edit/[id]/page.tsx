'use client';

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CustomerForm from '@/components/customers/CustomerForm';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, User, Loader2, AlertTriangle, UserPlus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EditCustomerPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const customerId = params.id as string;

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        fetchCustomer();
    }, [user, customerId]);

    const fetchCustomer = async () => {
        try {
            const response = await fetch(`/api/customers/${customerId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch customer');
            }

            const data = await response.json();
            setCustomer(data);
        } catch (err: any) {
            console.error('Error fetching customer:', err);
            setError(err.message || 'Failed to load customer');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        router.push('/dashboard/customers');
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={40} className="text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Customer Profile...</p>
                </div>
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="max-w-md w-full border-white/5" padding="p-8">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Fetch Error</h2>
                        <p className="text-slate-400 text-sm mb-8">
                            {error || 'The requested customer profile could not be located.'}
                        </p>
                        <Button
                            onClick={() => router.push('/dashboard/customers')}
                            className="w-full bg-blue-600 hover:bg-blue-500"
                        >
                            Return to Directory
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
                className="space-y-2 border-b border-white/10 pb-8"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                        <User size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Customer Management</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Edit Customer Profile
                </h1>
                <p className="text-sm text-slate-400">
                    Update <span className="text-white font-semibold">contact information</span> and relationship details for this customer.
                </p>
            </motion.div>

            <Card className="border-white/5 overflow-hidden" padding="p-8">
                <CustomerForm initialData={customer} customerId={customerId} isEdit={true} onSuccess={handleSuccess} />
            </Card>
        </div>
    );
}
