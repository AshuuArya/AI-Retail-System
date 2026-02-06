/**
 * Attribute Migration Script
 * Adds missing attributes to existing Appwrite collections
 */

const sdk = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = process.env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products';

async function addAttribute(collectionId, id, type, size, required, defaultValue, array = false) {
    console.log(`🔹 Adding attribute: ${id} (${type}) to ${collectionId}...`);
    try {
        if (type === 'integer') {
            await databases.createIntegerAttribute(DATABASE_ID, collectionId, id, required, null, null, defaultValue, array);
        } else if (type === 'string') {
            await databases.createStringAttribute(DATABASE_ID, collectionId, id, size, required, defaultValue, array);
        } else if (type === 'boolean') {
            await databases.createBooleanAttribute(DATABASE_ID, collectionId, id, required, defaultValue, array);
        } else if (type === 'float') {
            await databases.createFloatAttribute(DATABASE_ID, collectionId, id, required, defaultValue, array);
        }
        console.log(`✅ Attribute ${id} added.`);
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log(`ℹ️ Attribute ${id} already exists, skipping.`);
        } else {
            console.error(`❌ Error adding ${id}: ${e.message}`);
        }
    }
}

async function run() {
    console.log('🚀 STARTING ATTRIBUTE MIGRATION');

    // Products missing attributes
    await addAttribute(PRODUCTS_COLLECTION_ID, 'lowStockThreshold', 'integer', null, false, 10);
    await addAttribute(PRODUCTS_COLLECTION_ID, 'unit', 'string', 50, false, 'piece');
    await addAttribute(PRODUCTS_COLLECTION_ID, 'brand', 'string', 100, false, '');
    await addAttribute(PRODUCTS_COLLECTION_ID, 'tags', 'string', 100, false, null, true);
    await addAttribute(PRODUCTS_COLLECTION_ID, 'isActive', 'boolean', null, false, true);
    await addAttribute(PRODUCTS_COLLECTION_ID, 'barcode', 'string', 100, false, '');

    // Customers missing attributes
    const CUSTOMERS_COLLECTION_ID = process.env.APPWRITE_CUSTOMERS_COLLECTION_ID || 'customers';
    await addAttribute(CUSTOMERS_COLLECTION_ID, 'city', 'string', 100, false, '');
    await addAttribute(CUSTOMERS_COLLECTION_ID, 'state', 'string', 100, false, '');
    await addAttribute(CUSTOMERS_COLLECTION_ID, 'pincode', 'string', 20, false, '');
    await addAttribute(CUSTOMERS_COLLECTION_ID, 'notes', 'string', 2000, false, '');

    console.log('\n✨ MIGRATION COMPLETE');
}

run();
