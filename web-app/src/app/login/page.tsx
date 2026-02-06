'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessType } from '@/core/entities/Seller';

/**
 * BRAND NEW AUTH PAGE
 * Tab-based Sign In / Sign Up in one page
 */

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user } = useAuth();
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
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
            return;
        }

        if (searchParams.get('registered') === 'true') {
            setShowSuccess(true);
            setActiveTab('signin');
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [searchParams, user, router]);

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
            // Clear form
            setSignUpData({
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
        } catch (error: any) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0e1a' }}>
            <div style={{ maxWidth: '500px', width: '100%' }}>
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🛍️</div>
                    <h1 className="text-3xl font-bold" style={{ color: '#6366f1' }}>
                        AI Retail System
                    </h1>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                        Smart inventory management for retailers
                    </p>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="success">
                        ✓ Registration successful! Please sign in to continue.
                    </div>
                )}

                {/* Auth Card */}
                <div className="card">
                    {/* Tabs */}
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('signin');
                                setErrors({});
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('signup');
                                setErrors({});
                            }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Sign In Form */}
                    {activeTab === 'signin' && (
                        <form onSubmit={handleSignIn}>
                            <div className="input-group">
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={signInData.email}
                                    onChange={handleSignInChange}
                                    className="input"
                                    placeholder="your@email.com"
                                    required
                                />
                                {errors.email && <div className="error">{errors.email}</div>}
                            </div>

                            <div className="input-group">
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={signInData.password}
                                    onChange={handleSignInChange}
                                    className="input"
                                    placeholder="Enter password"
                                    required
                                />
                                {errors.password && <div className="error">{errors.password}</div>}
                            </div>

                            {errors.submit && <div className="error mb-4">{errors.submit}</div>}

                            <button type="submit" className="btn btn-success btn-full" disabled={loading}>
                                {loading ? 'Signing in...' : '🔓 Sign In'}
                            </button>
                        </form>
                    )}

                    {/* Sign Up Form */}
                    {activeTab === 'signup' && (
                        <form onSubmit={handleSignUp}>
                            <div className="input-group">
                                <label className="label">Company Name *</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={signUpData.companyName}
                                    onChange={handleSignUpChange}
                                    className="input"
                                    placeholder="Your Store Name"
                                />
                                {errors.companyName && <div className="error">{errors.companyName}</div>}
                            </div>

                            <div className="input-group">
                                <label className="label">Owner Name *</label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={signUpData.ownerName}
                                    onChange={handleSignUpChange}
                                    className="input"
                                    placeholder="Your Name"
                                />
                                {errors.ownerName && <div className="error">{errors.ownerName}</div>}
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="label">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={signUpData.email}
                                        onChange={handleSignUpChange}
                                        className="input"
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && <div className="error">{errors.email}</div>}
                                </div>

                                <div className="input-group">
                                    <label className="label">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={signUpData.phone}
                                        onChange={handleSignUpChange}
                                        className="input"
                                        placeholder="9876543210"
                                        maxLength={10}
                                    />
                                    {errors.phone && <div className="error">{errors.phone}</div>}
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="label">GST Number *</label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        value={signUpData.gstNumber}
                                        onChange={handleSignUpChange}
                                        className="input"
                                        placeholder="22AAAAA0000A1Z5"
                                    />
                                    {errors.gstNumber && <div className="error">{errors.gstNumber}</div>}
                                </div>

                                <div className="input-group">
                                    <label className="label">Business Type</label>
                                    <select
                                        name="businessType"
                                        value={signUpData.businessType}
                                        onChange={handleSignUpChange}
                                        className="input"
                                    >
                                        {Object.values(BusinessType).map((type) => (
                                            <option key={type} value={type}>
                                                {type.replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="label">Street Address *</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={signUpData.street}
                                    onChange={handleSignUpChange}
                                    className="input"
                                    placeholder="123 Main Street"
                                />
                                {errors.street && <div className="error">{errors.street}</div>}
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="label">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={signUpData.city}
                                        onChange={handleSignUpChange}
                                        className="input"
                                        placeholder="Mumbai"
                                    />
                                    {errors.city && <div className="error">{errors.city}</div>}
                                </div>

                                <div className="input-group">
                                    <label className="label">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={signUpData.state}
                                        onChange={handleSignUpChange}
                                        className="input"
                                        placeholder="Maharashtra"
                                    />
                                    {errors.state && <div className="error">{errors.state}</div>}
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="label">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={signUpData.pincode}
                                        onChange={handleSignUpChange}
                                        className="input"
                                        placeholder="400001"
                                        maxLength={6}
                                    />
                                    {errors.pincode && <div className="error">{errors.pincode}</div>}
                                </div>

                                <div className="input-group">
                                    <label className="label">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={signUpData.country}
                                        className="input"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="grid grid-2">
                                <div className="input-group">
                                    <label className="label">Password *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={signUpData.password}
                                        onChange={handleSignUpChange}
                                        className="input"
                                        placeholder="Min 8 characters"
                                    />
                                    {errors.password && <div className="error">{errors.password}</div>}
                                </div>

                                <div className="input-group">
                                    <label className="label">Confirm Password *</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={signUpData.confirmPassword}
                                        onChange={handleSignUpChange}
                                        className="input"
                                        placeholder="Re-enter password"
                                    />
                                    {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
                                </div>
                            </div>

                            {errors.submit && <div className="error mb-4">{errors.submit}</div>}

                            <button type="submit" className="btn btn-purple btn-full" disabled={loading}>
                                {loading ? 'Creating Account...' : '👤 Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0e1a' }}>
                <div style={{ color: 'white' }}>Loading...</div>
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
}
