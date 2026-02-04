/**
 * Seller Entity
 * Represents a business/shop owner using the platform
 */

export interface Seller {
    id: string;
    companyName: string;
    ownerName: string;
    gstNumber: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    businessType: BusinessType;
    logoUrl?: string;
    subscriptionPlan: SubscriptionPlan;
    isActive: boolean;
    setupCompleted: boolean; // Has completed inventory wizard
    createdAt: Date;
    updatedAt: Date;
}

export enum BusinessType {
    GROCERY = 'grocery',
    ELECTRONICS = 'electronics',
    CLOTHING = 'clothing',
    PHARMACY = 'pharmacy',
    GENERAL_STORE = 'general_store',
    RESTAURANT = 'restaurant',
    HARDWARE = 'hardware',
    BOOKS = 'books',
    JEWELRY = 'jewelry',
    OTHER = 'other',
}

export enum SubscriptionPlan {
    FREE = 'free',
    BASIC = 'basic',
    PREMIUM = 'premium',
    ENTERPRISE = 'enterprise',
}

export interface CreateSellerDTO {
    companyName: string;
    ownerName: string;
    gstNumber: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    businessType: BusinessType;
    password: string;
}

export interface UpdateSellerDTO {
    companyName?: string;
    ownerName?: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    businessType?: BusinessType;
    logoUrl?: string;
}
