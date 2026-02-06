/**
 * Enhanced Appwrite Database Migration Script
 * Automatically creates all required collections, attributes, and indexes
 */

const sdk = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Initialize Appwrite client
const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

// Collection IDs
const SELLERS_COLLECTION_ID = process.env.APPWRITE_SELLERS_COLLECTION_ID || 'sellers';
const SELLER_SETTINGS_COLLECTION_ID = process.env.APPWRITE_SELLER_SETTINGS_COLLECTION_ID || 'seller_settings';
const PRODUCTS_COLLECTION_ID = process.env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products';
const CUSTOMERS_COLLECTION_ID = process.env.APPWRITE_CUSTOMERS_COLLECTION_ID || 'customers';
const INVOICES_COLLECTION_ID = process.env.APPWRITE_INVOICES_COLLECTION_ID || 'invoices';

const DELAY = 2000; // Delay for attribute propagation

async function wait(ms = DELAY) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createSellersCollection() {
    console.log('📦 Setting up SELLERS collection...');
    try {
        await databases.createCollection(DATABASE_ID, SELLERS_COLLECTION_ID, 'Sellers', [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.any()),
            sdk.Permission.update(sdk.Role.any()),
            sdk.Permission.delete(sdk.Role.any()),
        ]);

        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'companyName', 255, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'ownerName', 255, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'gstNumber', 15, true);
        await databases.createEmailAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'email', true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'phone', 20, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'addressStreet', 255, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'addressCity', 100, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'addressState', 100, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'addressPincode', 10, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'addressCountry', 100, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'businessType', 50, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'logoUrl', 500, false);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'subscriptionPlan', 50, true);
        await databases.createBooleanAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'isActive', true, true);
        await databases.createBooleanAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'setupCompleted', false, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'passwordHash', 255, true);

        await wait();
        await databases.createIndex(DATABASE_ID, SELLERS_COLLECTION_ID, 'email_unique', 'unique', ['email']);
        await databases.createIndex(DATABASE_ID, SELLERS_COLLECTION_ID, 'gst_unique', 'unique', ['gstNumber']);
        console.log('✅ SELLERS collection ready');
    } catch (e) {
        console.log(`⚠️ SELLERS: ${e.message}`);
    }
}

async function createSettingsCollection() {
    console.log('📦 Setting up SELLER_SETTINGS collection...');
    try {
        await databases.createCollection(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'Seller Settings', [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.any()),
            sdk.Permission.update(sdk.Role.any()),
            sdk.Permission.delete(sdk.Role.any()),
        ]);

        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'sellerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'enabledFields', 5000, true);
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'customFields', 5000, true);
        await databases.createBooleanAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'aiImageEnabled', true, true);
        await databases.createBooleanAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'aiDescriptionEnabled', true, true);
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'currency', 10, true);
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'taxSettings', 5000, true);
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'inventoryAlerts', 5000, true);

        await wait();
        await databases.createIndex(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'seller_idx', 'unique', ['sellerId']);
        console.log('✅ SELLER_SETTINGS collection ready');
    } catch (e) {
        console.log(`⚠️ SETTINGS: ${e.message}`);
    }
}

async function createProductsCollection() {
    console.log('📦 Setting up PRODUCTS collection...');
    try {
        await databases.createCollection(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'Products', [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.any()),
            sdk.Permission.update(sdk.Role.any()),
            sdk.Permission.delete(sdk.Role.any()),
        ]);

        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'sellerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'itemId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'itemName', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'category', 100, true);
        await databases.createFloatAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'quantity', true);
        await databases.createFloatAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'costPrice', true);
        await databases.createFloatAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'sellPrice', true);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'additionalFields', 5000, false);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'customImageUrl', 500, false);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'userEditedDescription', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'aiGeneratedImageUrl', 500, false);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'aiGeneratedDescription', 2000, false);
        await databases.createIntegerAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'lowStockThreshold', false, 10);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'unit', 50, false, 'piece');
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'brand', 100, false);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'tags', 100, false, undefined, true);
        await databases.createBooleanAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'isActive', false, true);

        await wait();
        await databases.createIndex(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'seller_idx', 'key', ['sellerId']);
        await databases.createIndex(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'item_idx', 'key', ['itemId']);
        console.log('✅ PRODUCTS collection ready');
    } catch (e) {
        console.log(`⚠️ PRODUCTS: ${e.message}`);
    }
}

async function createCustomersCollection() {
    console.log('📦 Setting up CUSTOMERS collection...');
    try {
        await databases.createCollection(DATABASE_ID, CUSTOMERS_COLLECTION_ID, 'Customers', [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.any()),
            sdk.Permission.update(sdk.Role.any()),
            sdk.Permission.delete(sdk.Role.any()),
        ]);

        await databases.createStringAttribute(DATABASE_ID, CUSTOMERS_COLLECTION_ID, 'sellerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, CUSTOMERS_COLLECTION_ID, 'name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, CUSTOMERS_COLLECTION_ID, 'email', 255, false);
        await databases.createStringAttribute(DATABASE_ID, CUSTOMERS_COLLECTION_ID, 'phone', 20, false);
        await databases.createStringAttribute(DATABASE_ID, CUSTOMERS_COLLECTION_ID, 'address', 1000, false);
        await databases.createFloatAttribute(DATABASE_ID, CUSTOMERS_COLLECTION_ID, 'totalSpending', false, 0);
        await databases.createStringAttribute(DATABASE_ID, CUSTOMERS_COLLECTION_ID, 'lastPurchaseDate', 100, false);

        await wait();
        await databases.createIndex(DATABASE_ID, CUSTOMERS_COLLECTION_ID, 'seller_idx', 'key', ['sellerId']);
        console.log('✅ CUSTOMERS collection ready');
    } catch (e) {
        console.log(`⚠️ CUSTOMERS: ${e.message}`);
    }
}

async function createInvoicesCollection() {
    console.log('📦 Setting up INVOICES collection...');
    try {
        await databases.createCollection(DATABASE_ID, INVOICES_COLLECTION_ID, 'Invoices', [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.any()),
            sdk.Permission.update(sdk.Role.any()),
            sdk.Permission.delete(sdk.Role.any()),
        ]);

        await databases.createStringAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'sellerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'customerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'invoiceNumber', 100, true);
        await databases.createStringAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'invoiceDate', 100, true);
        await databases.createStringAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'items', 8000, true);
        await databases.createFloatAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'subtotal', true);
        await databases.createFloatAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'discount', true);
        await databases.createFloatAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'total', true);
        await databases.createStringAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'paymentMethod', 50, true);
        await databases.createStringAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'notes', 1000, false);
        await databases.createStringAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'status', 50, true);
        await databases.createStringAttribute(DATABASE_ID, INVOICES_COLLECTION_ID, 'customerName', 255, false);

        await wait();
        await databases.createIndex(DATABASE_ID, INVOICES_COLLECTION_ID, 'seller_idx', 'key', ['sellerId']);
        await databases.createIndex(DATABASE_ID, INVOICES_COLLECTION_ID, 'invoice_idx', 'unique', ['invoiceNumber']);
        console.log('✅ INVOICES collection ready');
    } catch (e) {
        console.log(`⚠️ INVOICES: ${e.message}`);
    }
}

async function run() {
    console.log('🚀 INITIALIZING APPWRITE SETUP');
    if (!DATABASE_ID) {
        console.error('❌ ERROR: APPWRITE_DATABASE_ID is not set in .env.local');
        return;
    }

    await createSellersCollection();
    await createSettingsCollection();
    await createProductsCollection();
    await createCustomersCollection();
    await createInvoicesCollection();

    console.log('\n✨ SETUP COMPLETE');
    console.log('Verify your collections in the Appwrite Console.');
}

run();
