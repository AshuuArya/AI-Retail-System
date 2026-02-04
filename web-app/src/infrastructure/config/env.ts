/**
 * Environment Configuration
 * Validates and exports environment variables
 */

// Validate required environment variables
const requiredEnvVars = [
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
    'APPWRITE_API_KEY',
] as const;

function validateEnv() {
    const missing = requiredEnvVars.filter(
        (key) => !process.env[key]
    );

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please copy .env.example to .env.local and fill in the values.\n' +
            'See SETUP_GUIDE.md for detailed instructions.'
        );
    }
}

// Only validate in server-side code
if (typeof window === 'undefined') {
    validateEnv();
}

export const config = {
    // Appwrite
    appwrite: {
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
        projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
        apiKey: process.env.APPWRITE_API_KEY!,
        databaseId: process.env.APPWRITE_DATABASE_ID || 'retail_db',
        collections: {
            products: process.env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products',
            orders: process.env.APPWRITE_ORDERS_COLLECTION_ID || 'orders',
            customers: process.env.APPWRITE_CUSTOMERS_COLLECTION_ID || 'customers',
            invoices: process.env.APPWRITE_INVOICES_COLLECTION_ID || 'invoices',
        },
    },

    // AI Provider
    ai: {
        provider: (process.env.AI_PROVIDER || 'openai') as 'openai' | 'gemini',
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        },
        gemini: {
            apiKey: process.env.GOOGLE_AI_API_KEY,
            model: process.env.GOOGLE_AI_MODEL || 'gemini-1.5-flash',
        },
    },

    // Features
    features: {
        aiSearch: process.env.ENABLE_AI_SEARCH === 'true',
        aiInventory: process.env.ENABLE_AI_INVENTORY === 'true',
        payments: process.env.ENABLE_PAYMENTS === 'true',
    },

    // App
    app: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'AI Retail System',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
} as const;

export type Config = typeof config;
