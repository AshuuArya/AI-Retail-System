'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessType } from '@/core/entities/Seller';

/**
 * Company Registration Form
 * Multi-step form for seller onboarding with company details and GST
 */
export default function CompanyRegistrationForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        companyName: '',
        ownerName: '',
        email: '',
        phone: '',

        // Step 2: Business Details
        gstNumber: '',
        businessType: BusinessType.GENERAL_STORE,

        // Step 3: Address
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',

        // Step 4: Security
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        // Redirect if already logged in
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
            if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Invalid email format';
            }
            if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
            else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
                newErrors.phone = 'Invalid Indian phone number';
            }
        }

        if (currentStep === 2) {
            if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
            else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
                newErrors.gstNumber = 'Invalid GST number format';
            }
        }

        if (currentStep === 3) {
            if (!formData.street.trim()) newErrors.street = 'Street address is required';
            if (!formData.city.trim()) newErrors.city = 'City is required';
            if (!formData.state.trim()) newErrors.state = 'State is required';
            if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
            else if (!/^\d{6}$/.test(formData.pincode)) {
                newErrors.pincode = 'Invalid pincode (must be 6 digits)';
            }
        }

        if (currentStep === 4) {
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(4)) return;

        setLoading(true);
        try {
            const response = await fetch('/api/sellers/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: formData.companyName,
                    ownerName: formData.ownerName,
                    email: formData.email,
                    phone: formData.phone,
                    gstNumber: formData.gstNumber,
                    businessType: formData.businessType,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        country: formData.country,
                    },
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            const data = await response.json();

            // Show success message
            setErrors({
                submit: ''
            });

            // Redirect to login with success message
            router.push('/login?registered=true');

        } catch (error: any) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${s < step ? 'bg-green-500 text-white' :
                            s === step ? 'bg-purple-600 text-white' :
                                'bg-gray-200 text-gray-600'
                            }`}>
                            {s < step ? '✓' : s}
                        </div>
                        {s < 4 && (
                            <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
                <span>Basic Info</span>
                <span>Business</span>
                <span>Address</span>
                <span>Security</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome to AI Retail System
                    </h1>
                    <p className="text-gray-600">
                        Let's set up your business account in just a few steps
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Tab Switcher */}
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-gray-600 hover:text-gray-900"
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-all bg-white text-purple-600 shadow-sm"
                        >
                            Sign Up
                        </button>
                    </div>

                    {renderProgressBar()}

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Basic Information
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company/Shop Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="e.g., Sharma General Store"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.companyName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Owner Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        placeholder="e.g., Rajesh Sharma"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.ownerName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                        maxLength={10}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Business Details */}
                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Business Details
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        GST Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        placeholder="22AAAAA0000A1Z5"
                                        maxLength={15}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        15-character GST identification number
                                    </p>
                                    {errors.gstNumber && (
                                        <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Type *
                                    </label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value={BusinessType.GENERAL_STORE}>General Store</option>
                                        <option value={BusinessType.GROCERY}>Grocery Store</option>
                                        <option value={BusinessType.ELECTRONICS}>Electronics Shop</option>
                                        <option value={BusinessType.CLOTHING}>Clothing/Fashion</option>
                                        <option value={BusinessType.PHARMACY}>Pharmacy</option>
                                        <option value={BusinessType.RESTAURANT}>Restaurant/Cafe</option>
                                        <option value={BusinessType.HARDWARE}>Hardware Store</option>
                                        <option value={BusinessType.BOOKS}>Book Store</option>
                                        <option value={BusinessType.JEWELRY}>Jewelry Store</option>
                                        <option value={BusinessType.OTHER}>Other</option>
                                    </select>
                                    <p className="text-sm text-gray-500 mt-1">
                                        This helps us customize your inventory fields
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Address */}
                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Business Address
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="Shop No. 123, Main Road"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.street && (
                                        <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Mumbai"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Maharashtra"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        {errors.state && (
                                            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="400001"
                                        maxLength={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.pincode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Security */}
                        {step === 4 && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Create Password
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Minimum 8 characters"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {errors.submit && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        {errors.submit}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    ← Back
                                </button>
                            )}

                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="ml-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-purple-600 hover:underline font-medium">
                        Sign in here
                    </a>
                </p>
            </div>
        </div>
    );
}
