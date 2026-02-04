'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Account, Models } from 'appwrite';
import { getAppwriteClient } from '@/infrastructure/appwrite/client';

interface User {
    $id: string;
    email: string;
    companyName: string;
    setupCompleted: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const client = getAppwriteClient();
    const account = new Account(client);

    // Check for existing session on mount
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const session = await account.get();
            if (session) {
                // Fetch seller details from prefs or database
                const prefs = session.prefs as any;
                setUser({
                    $id: session.$id,
                    email: session.email,
                    companyName: prefs?.companyName || 'Your Store',
                    setupCompleted: prefs?.setupCompleted || false,
                });
            }
        } catch (error) {
            // No active session
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            const session = await account.get();
            if (session) {
                const prefs = session.prefs as any;
                setUser({
                    $id: session.$id,
                    email: session.email,
                    companyName: prefs?.companyName || 'Your Store',
                    setupCompleted: prefs?.setupCompleted || false,
                });
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            // Create email session
            await account.createEmailPasswordSession(email, password);

            // Get user details
            const session = await account.get();
            const prefs = session.prefs as any;

            const userData: User = {
                $id: session.$id,
                email: session.email,
                companyName: prefs?.companyName || 'Your Store',
                setupCompleted: prefs?.setupCompleted || false,
            };

            setUser(userData);

            // Redirect based on setup status
            const redirectPath = localStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                localStorage.removeItem('redirectAfterLogin');
                router.push(redirectPath);
            } else if (!userData.setupCompleted) {
                router.push('/dashboard/onboarding');
            } else {
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed. Please check your credentials.');
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout on client side even if server fails
            setUser(null);
            router.push('/');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
