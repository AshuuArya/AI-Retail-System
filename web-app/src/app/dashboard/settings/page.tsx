'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        companyName: user?.companyName || '',
        gstNumber: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        businessHours: {
            open: '09:00',
            close: '18:00'
        }
    });
    const [preferences, setPreferences] = useState({
        itemsPerPage: 25,
        defaultView: 'grid',
        compactMode: false,
        notifications: {
            lowStock: true,
            email: true,
            desktop: false
        },
        language: 'en'
    });
    const [saving, setSaving] = useState(false);

    const tabs = [
        { id: 'profile', name: 'Business Profile', icon: '🏢' },
        { id: 'preferences', name: 'Preferences', icon: '⚙️' },
        { id: 'appearance', name: 'Appearance', icon: '🎨' },
        { id: 'account', name: 'Account', icon: '👤' }
    ];

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            // TODO: Add API call to update user profile
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSavePreferences = () => {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        alert('Preferences saved!');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your business profile and preferences
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 mb-6">
                    <div className="border-b border-gray-200 dark:border-slate-800">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-slate-600'
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Business Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.companyName}
                                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                GST Number
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.gstNumber}
                                                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="22AAAAA0000A1Z5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="+91 1234567890"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Street Address
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.address.street}
                                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.address.city}
                                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.address.state}
                                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Pincode
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.address.pincode}
                                                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Hours</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Opening Time
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.businessHours.open}
                                                onChange={(e) => setFormData({ ...formData, businessHours: { ...formData.businessHours, open: e.target.value } })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Closing Time
                                            </label>
                                            <input
                                                type="time"
                                                value={formData.businessHours.close}
                                                onChange={(e) => setFormData({ ...formData, businessHours: { ...formData.businessHours, close: e.target.value } })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Display Preferences</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Items Per Page
                                            </label>
                                            <select
                                                value={preferences.itemsPerPage}
                                                onChange={(e) => setPreferences({ ...preferences, itemsPerPage: parseInt(e.target.value) })}
                                                className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="compactMode"
                                                checked={preferences.compactMode}
                                                onChange={(e) => setPreferences({ ...preferences, compactMode: e.target.checked })}
                                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                            />
                                            <label htmlFor="compactMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Enable Compact Mode
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="lowStock"
                                                checked={preferences.notifications.lowStock}
                                                onChange={(e) => setPreferences({
                                                    ...preferences,
                                                    notifications: { ...preferences.notifications, lowStock: e.target.checked }
                                                })}
                                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                            />
                                            <label htmlFor="lowStock" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Low Stock Alerts
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="emailNotif"
                                                checked={preferences.notifications.email}
                                                onChange={(e) => setPreferences({
                                                    ...preferences,
                                                    notifications: { ...preferences.notifications, email: e.target.checked }
                                                })}
                                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                            />
                                            <label htmlFor="emailNotif" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Email Notifications
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSavePreferences}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Theme</h2>
                                    <div className="space-y-3">
                                        {[
                                            { value: 'light', label: 'Light Mode', icon: '☀️' },
                                            { value: 'dark', label: 'Dark Mode', icon: '🌙' },
                                            { value: 'system', label: 'System Default', icon: '💻' }
                                        ].map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <input
                                                    type="radio"
                                                    name="theme"
                                                    value={option.value}
                                                    checked={theme === option.value}
                                                    onChange={(e) => setTheme(e.target.value as any)}
                                                    className="w-4 h-4 text-purple-600"
                                                />
                                                <span className="text-2xl">{option.icon}</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Account Tab */}
                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email
                                            </label>
                                            <p className="text-gray-900 dark:text-white">{user?.email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                User ID
                                            </label>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm font-mono">{user?.$id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Danger Zone</h3>
                                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
