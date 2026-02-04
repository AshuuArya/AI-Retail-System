/**
 * Seller Settings Entity
 * Stores seller's inventory configuration and preferences
 */

export interface SellerSettings {
    sellerId: string;
    enabledFields: EnabledField[];
    customFields: CustomField[];
    aiImageEnabled: boolean;
    aiDescriptionEnabled: boolean;
    currency: string;
    taxSettings: TaxSettings;
    inventoryAlerts: InventoryAlertSettings;
    createdAt: Date;
    updatedAt: Date;
}

export interface EnabledField {
    fieldName: string;
    isRequired: boolean;
    displayOrder: number;
}

export interface CustomField {
    id: string;
    name: string;
    type: CustomFieldType;
    isRequired: boolean;
    options?: string[]; // For dropdown type
    defaultValue?: string;
    displayOrder: number;
}

export enum CustomFieldType {
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    DROPDOWN = 'dropdown',
    TEXTAREA = 'textarea',
    BOOLEAN = 'boolean',
}

export interface TaxSettings {
    defaultGstRate: number;
    includeTaxInPrice: boolean;
    gstCategories: GSTCategory[];
}

export interface GSTCategory {
    name: string;
    rate: number;
}

export interface InventoryAlertSettings {
    lowStockThreshold: number;
    enableEmailAlerts: boolean;
    enableSMSAlerts: boolean;
}

// Available optional fields that sellers can enable
export const AVAILABLE_OPTIONAL_FIELDS = [
    { name: 'brand', label: 'Brand', type: 'text', description: 'Product brand or manufacturer' },
    { name: 'size', label: 'Size/Dimensions', type: 'text', description: 'Product size or dimensions' },
    { name: 'color', label: 'Color/Variant', type: 'text', description: 'Product color or variant' },
    { name: 'weight', label: 'Weight', type: 'number', description: 'Product weight in kg' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date', description: 'Product expiration date' },
    { name: 'supplier', label: 'Supplier', type: 'text', description: 'Supplier name or code' },
    { name: 'minStockLevel', label: 'Min Stock Level', type: 'number', description: 'Minimum stock alert level' },
    { name: 'taxRate', label: 'Tax Rate (%)', type: 'number', description: 'GST or tax rate' },
    { name: 'shelfLocation', label: 'Shelf Location', type: 'text', description: 'Physical location in store' },
    { name: 'manufacturer', label: 'Manufacturer', type: 'text', description: 'Product manufacturer' },
    { name: 'warranty', label: 'Warranty Period', type: 'text', description: 'Warranty duration' },
    { name: 'sku', label: 'SKU', type: 'text', description: 'Stock Keeping Unit' },
] as const;

// Pre-built templates for common business types
export const FIELD_TEMPLATES = {
    grocery: {
        name: 'Grocery Store',
        description: 'For grocery and food items',
        enabledFields: ['brand', 'weight', 'expiryDate', 'supplier'],
        customFields: [],
    },
    electronics: {
        name: 'Electronics Shop',
        description: 'For electronic items and gadgets',
        enabledFields: ['brand', 'warranty', 'manufacturer', 'sku'],
        customFields: [
            { name: 'Model Number', type: CustomFieldType.TEXT, isRequired: false },
            { name: 'Specifications', type: CustomFieldType.TEXTAREA, isRequired: false },
        ],
    },
    clothing: {
        name: 'Clothing/Fashion',
        description: 'For apparel and fashion items',
        enabledFields: ['brand', 'size', 'color', 'manufacturer'],
        customFields: [
            { name: 'Material', type: CustomFieldType.TEXT, isRequired: false },
            { name: 'Care Instructions', type: CustomFieldType.TEXTAREA, isRequired: false },
        ],
    },
    pharmacy: {
        name: 'Pharmacy',
        description: 'For medicines and healthcare products',
        enabledFields: ['brand', 'expiryDate', 'manufacturer', 'supplier'],
        customFields: [
            { name: 'Batch Number', type: CustomFieldType.TEXT, isRequired: true },
            { name: 'Composition', type: CustomFieldType.TEXTAREA, isRequired: false },
            { name: 'Prescription Required', type: CustomFieldType.BOOLEAN, isRequired: true },
        ],
    },
    general_store: {
        name: 'General Store',
        description: 'For general retail stores',
        enabledFields: ['brand', 'supplier', 'shelfLocation'],
        customFields: [],
    },
} as const;

export interface CreateSellerSettingsDTO {
    sellerId: string;
    enabledFields: EnabledField[];
    customFields: CustomField[];
    aiImageEnabled: boolean;
    aiDescriptionEnabled: boolean;
    currency?: string;
    taxSettings?: TaxSettings;
}

export interface UpdateSellerSettingsDTO {
    enabledFields?: EnabledField[];
    customFields?: CustomField[];
    aiImageEnabled?: boolean;
    aiDescriptionEnabled?: boolean;
    currency?: string;
    taxSettings?: TaxSettings;
    inventoryAlerts?: InventoryAlertSettings;
}
