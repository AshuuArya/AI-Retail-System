'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessType } from '@/core/entities/Seller';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    UserPlus,
    LogIn,
    Store,
    Mail,
    Lock,
    Phone,
    MapPin,
    CreditCard,
    UserCircle,
    Building2,
    ArrowRight
} from 'lucide-react';

/**
 * PREMIUM AUTH PAGE
 * Obsidian-styled Tabbed Sign In / Sign Up
 */

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user } = useAuth();
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(
        searchParams.get('tab') === 'signup' ? 'signup' : 'signin'
    );
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Sign In Form
    const [signInData, setSignInData] = useState({
        email: '',
        password: '',
    });

    // Sign Up Form
    const [signUpData, setSignUpData] = useState({
        companyName: '',
        ownerName: '',
        email: '',
        phone: '',
        gstNumber: '',
        businessType: BusinessType.GENERAL_STORE,
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignInData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSignUpData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await login(signInData.email, signInData.password);
        } catch (error: any) {
            setErrors({ submit: error.message || 'Login failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Basic validation
        const newErrors: Record<string, string> = {};
        if (!signUpData.companyName) newErrors.companyName = 'Required';
        if (!signUpData.ownerName) newErrors.ownerName = 'Required';
        if (!signUpData.email) newErrors.email = 'Required';
        if (!signUpData.phone || !/^[6-9]\d{9}$/.test(signUpData.phone)) {
            newErrors.phone = 'Invalid phone';
        }
        if (!signUpData.gstNumber) newErrors.gstNumber = 'Required';
        if (!signUpData.street) newErrors.street = 'Required';
        if (!signUpData.city) newErrors.city = 'Required';
        if (!signUpData.state) newErrors.state = 'Required';
        if (!signUpData.pincode || !/^\d{6}$/.test(signUpData.pincode)) {
            newErrors.pincode = 'Invalid pincode';
        }
        if (!signUpData.password || signUpData.password.length < 8) {
            newErrors.password = 'Min 8 characters';
        }
        if (signUpData.password !== signUpData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signUpData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            setShowSuccess(true);
            setActiveTab('signin');
        } catch (error: any) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center p-6 selection:bg-blue-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <main className="w-full max-w-[550px] relative z-10 space-y-10">
                {/* Brand Logo & Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-600/20 mb-2">
                        <Store size={40} className="text-white" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight text-white">
                            AI Retail <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">System</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium tracking-wide">
                            The future of smart inventory management
                        </p>
                    </div>
                </motion.div>

                {/* Auth Container */}
                <Card className="border-white/5 shadow-3xl bg-white/[0.01]" padding="p-0 overflow-hidden">
                    {/* Tabs Header */}
                    <div className="flex border-b border-white/5 p-2 bg-white/[0.02]">
                        <button
                            onClick={() => setActiveTab('signin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-500 ${activeTab === 'signin'
                                    ? 'bg-white/5 text-white shadow-xl border border-white/10'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <LogIn size={16} />
                            Sign In
                        </button>
                        <button
                            onClick={() => setActiveTab('signup')}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-500 ${activeTab === 'signup'
                                    ? 'bg-white/5 text-white shadow-xl border border-white/10'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <UserPlus size={16} />
                            Create Account
                        </button>
                    </div>

                    <div className="p-10">
                        <AnimatePresence mode="wait">
                            {showSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-medium mb-8 flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">✓</div>
                                    Welcome! Account created successfully. Please sign in.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Forms */}
                        <AnimatePresence mode="wait">
                            {activeTab === 'signin' ? (
                                <motion.form
                                    key="signin"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleSignIn}
                                    className="space-y-6"
                                >
                                    <Input
                                        label="Corporate Email"
                                        type="email"
                                        name="email"
                                        placeholder="name@company.com"
                                        value={signInData.email}
                                        onChange={handleSignInChange}
                                        icon={<Mail size={18} />}
                                        error={errors.email}
                                        required
                                    />
                                    <Input
                                        label="Secure Password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={signInData.password}
                                        onChange={handleSignInChange}
                                        icon={<Lock size={18} />}
                                        error={errors.password}
                                        required
                                    />

                                    {errors.submit && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium">
                                            {errors.submit}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 group"
                                        isLoading={loading}
                                    >
                                        Access Dashboard
                                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="signup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleSignUp}
                                    className="space-y-8"
                                >
                                    {/* Company Info Section */}
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3 ml-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Business Identity</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <Input
                                                    label="Legal Business Name"
                                                    name="companyName"
                                                    placeholder="Acme Retail Ltd."
                                                    value={signUpData.companyName}
                                                    onChange={handleSignUpChange}
                                                    icon={<Building2 size={18} />}
                                                    error={errors.companyName}
                                                />
                                            </div>
                                            <Input
                                                label="Proprietor Name"
                                                name="ownerName"
                                                placeholder="John Doe"
                                                value={signUpData.ownerName}
                                                onChange={handleSignUpChange}
                                                icon={<UserCircle size={18} />}
                                                error={errors.ownerName}
                                            />
                                            <Input
                                                label="GST Identification No."
                                                name="gstNumber"
                                                placeholder="22AAAAA0000A1Z5"
                                                value={signUpData.gstNumber}
                                                onChange={handleSignUpChange}
                                                icon={<CreditCard size={18} />}
                                                error={errors.gstNumber}
                                            />
                                        </div>
                                    </section>

                                    {/* Contact Section */}
                                    <section className="space-y-6 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-3 ml-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contact & Security</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Email Address"
                                                type="email"
                                                name="email"
                                                placeholder="john@example.com"
                                                value={signUpData.email}
                                                onChange={handleSignUpChange}
                                                icon={<Mail size={18} />}
                                                error={errors.email}
                                            />
                                            <Input
                                                label="Contact Hotline"
                                                type="tel"
                                                name="phone"
                                                placeholder="9876543210"
                                                value={signUpData.phone}
                                                onChange={handleSignUpChange}
                                                icon={<Phone size={18} />}
                                                error={errors.phone}
                                            />
                                            <Input
                                                label="Create Password"
                                                type="password"
                                                name="password"
                                                placeholder="••••••••"
                                                value={signUpData.password}
                                                onChange={handleSignUpChange}
                                                icon={<Lock size={18} />}
                                                error={errors.password}
                                            />
                                            <Input
                                                label="Confirm Password"
                                                type="password"
                                                name="confirmPassword"
                                                placeholder="••••••••"
                                                value={signUpData.confirmPassword}
                                                onChange={handleSignUpChange}
                                                icon={<Lock size={18} />}
                                                error={errors.confirmPassword}
                                            />
                                        </div>
                                    </section>

                                    {/* Location Section */}
                                    <section className="space-y-6 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-3 ml-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Store Location</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-3">
                                                <Input
                                                    label="Warehouse/Store Address"
                                                    name="street"
                                                    placeholder="Unit 12, High Street"
                                                    value={signUpData.street}
                                                    onChange={handleSignUpChange}
                                                    icon={<MapPin size={18} />}
                                                    error={errors.street}
                                                />
                                            </div>
                                            <Input
                                                label="City"
                                                name="city"
                                                placeholder="Mumbai"
                                                value={signUpData.city}
                                                onChange={handleSignUpChange}
                                                error={errors.city}
                                            />
                                            <Input
                                                label="State"
                                                name="state"
                                                placeholder="Maharashtra"
                                                value={signUpData.state}
                                                onChange={handleSignUpChange}
                                                error={errors.state}
                                            />
                                            <Input
                                                label="Pincode"
                                                name="pincode"
                                                placeholder="400001"
                                                value={signUpData.pincode}
                                                onChange={handleSignUpChange}
                                                error={errors.pincode}
                                            />
                                        </div>
                                    </section>

                                    {errors.submit && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium">
                                            {errors.submit}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/20 group"
                                        isLoading={loading}
                                    >
                                        Register Business
                                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>

                {/* Footer Links */}
                <div className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest pb-10">
                    &copy; 2026 AI Retail Management &middot; Secured by Appwrite Cloud
                </div>
            </main>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0b10] flex items-center justify-center font-black uppercase tracking-[0.2em] text-slate-700">
                Initializing Portal...
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
}
