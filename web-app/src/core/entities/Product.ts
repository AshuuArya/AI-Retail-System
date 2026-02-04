/**
 * Updated Product Entity with Flexible Fields
 * Supports dynamic fields based on seller configuration
 */

export interface Product {
    id: string;
    sellerId: string; // NEW: Links product to seller

    // Core required fields (always present)
    itemId: string; // Barcode/SKU - unique per seller
    itemName: string;
    category: string;
    quantity: number;
    costPrice: number; // In seller's currency (default: INR)
    sellPrice: number;

    // Optional standard fields (based on seller settings)
    additionalFields?: Record<string, any>; // Dynamic fields

    // AI-generated content
    aiGeneratedImageUrl?: string;
    aiGeneratedDescription?: string;
    customImageUrl?: string; // If user uploads custom image
    userEditedDescription?: string; // If user edits AI description

    // Metadata
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductDTO {
    sellerId: string;
    itemId: string; // Barcode/SKU
    itemName: string;
    category: string;
    quantity: number;
    costPrice: number;
    sellPrice: number;
    additionalFields?: Record<string, any>;
    customImageUrl?: string;
    userEditedDescription?: string;
}

export interface UpdateProductDTO {
    itemId?: string;
    itemName?: string;
    category?: string;
    quantity?: number;
    costPrice?: number;
    sellPrice?: number;
    additionalFields?: Record<string, any>;
    aiGeneratedImageUrl?: string;
    aiGeneratedDescription?: string;
    customImageUrl?: string;
    userEditedDescription?: string;
}

// Helper type for product with calculated fields
export interface ProductWithCalculations extends Product {
    profitMargin: number; // (sellPrice - costPrice) / costPrice * 100
    profitAmount: number; // sellPrice - costPrice
    inventoryValue: number; // costPrice * quantity
    isLowStock: boolean; // Based on seller's threshold
}
