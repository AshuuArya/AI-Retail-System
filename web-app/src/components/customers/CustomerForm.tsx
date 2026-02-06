'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input, TextArea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, MapPin, FileText, Check, AlertCircle } from 'lucide-react';

interface CustomerFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes: string;
}

interface CustomerFormProps {
    initialData?: Partial<CustomerFormData>;
    customerId?: string;
    onSuccess?: () => void;
    isEdit?: boolean;
}

export default function CustomerForm({ initialData, customerId, onSuccess, isEdit }: CustomerFormProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<CustomerFormData>({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        pincode: initialData?.pincode || '',
        notes: initialData?.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.name.trim() || !formData.phone.trim()) {
            setError('Name and phone number are required');
            setLoading(false);
            return;
        }

        try {
            const url = customerId ? `/api/customers/${customerId}` : '/api/customers';
            const method = customerId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    sellerId: user?.$id,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save customer');
            }

            if (onSuccess) onSuccess();
            else router.push('/dashboard/customers');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium"
                    >
                        <AlertCircle size={18} />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Identity Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 ml-1">
                    <User size={16} className="text-slate-500" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Customer Identity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <Input
                            label="Full Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., John Doe"
                            icon={<User size={16} />}
                        />
                    </div>
                    <Input
                        label="Phone Number *"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91..."
                        icon={<Phone size={16} />}
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        icon={<Mail size={16} />}
                    />
                </div>
            </div>

            {/* Location */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3 ml-1">
                    <MapPin size={16} className="text-slate-500" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                        <Input
                            label="Street Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Apt 123, Street Name"
                        />
                    </div>
                    <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                    />
                    <Input
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3 ml-1">
                    <FileText size={16} className="text-slate-500" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Additional Context</h3>
                </div>
                <TextArea
                    label="Internal Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any specific preferences or history for this customer..."
                    className="min-h-[120px]"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/5">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="px-6"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="h-12 px-10 bg-blue-600 hover:bg-blue-500 border-0 shadow-lg shadow-blue-600/20"
                    isLoading={loading}
                >
                    <Check size={18} className="mr-2" />
                    {isEdit ? 'Update Details' : 'Register Customer'}
                </Button>
            </div>
        </form>
    );
}
