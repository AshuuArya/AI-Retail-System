'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Settings, Building, Palette, User as UserIcon, Save } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        companyName: user?.companyName || '',
        gstNumber: '',
        phone: '',
    });
    const [saving, setSaving] = useState(false);

    const tabs = [
        { id: 'profile', name: 'Business Profile', icon: Building },
        { id: 'appearance', name: 'Appearance', icon: Palette },
        { id: 'account', name: 'Account Info', icon: UserIcon }
    ];

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            // Actual API call would go here
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8"
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Settings size={16} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Configuration</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Settings
                    </h1>
                    <p className="text-sm text-slate-400">
                        Manage your business preferences and profile.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="border-white/5 h-fit" padding="p-2">
                        <div className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <Card className="border-white/5" padding="p-8">
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <div className="border-b border-white/10 pb-6 mb-6">
                                    <h2 className="text-xl font-bold text-white">Business Information</h2>
                                    <p className="text-xs text-slate-500 mt-1">Information used for your invoices and business operations.</p>
                                </div>

                                <div className="space-y-6">
                                    <Input
                                        label="Business Legal Name"
                                        placeholder="Enter company name"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="h-11"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="GST / Tax ID"
                                            placeholder="22AAAAA0000A1Z5"
                                            value={formData.gstNumber}
                                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                            className="h-11"
                                        />
                                        <Input
                                            label="Contact Phone"
                                            placeholder="+91..."
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="pt-6">
                                        <Button
                                            onClick={handleSaveProfile}
                                            isLoading={saving}
                                            className="bg-blue-600 hover:bg-blue-500 h-11 px-8 rounded-xl font-bold text-xs"
                                        >
                                            <Save size={16} className="mr-2" />
                                            Update Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-8">
                                <div className="border-b border-white/10 pb-6 mb-6">
                                    <h2 className="text-xl font-bold text-white">Appearance Settings</h2>
                                    <p className="text-xs text-slate-500 mt-1">Customize the visual experience of your dashboard.</p>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <Palette size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Dark Mode</p>
                                            <p className="text-xs text-slate-500">Currently active across the system.</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">Active</div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="space-y-8">
                                <div className="border-b border-white/10 pb-6 mb-6">
                                    <h2 className="text-xl font-bold text-white">Account Details</h2>
                                    <p className="text-xs text-slate-500 mt-1">Manage your administrator account information.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Display Name</p>
                                        <p className="text-sm font-bold text-white">{user?.name || 'Administrator'}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-white">{user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
