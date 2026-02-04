/**
 * Appwrite Database Migration Script
 * Automatically creates all required collections and attributes
 * 
 * Run this script once to set up your database:
 * node scripts/setup-appwrite.js
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
const SELLERS_COLLECTION_ID = 'sellers';
const SELLER_SETTINGS_COLLECTION_ID = 'seller_settings';
const PRODUCTS_COLLECTION_ID = 'products';

async function createSellersCollection() {
    console.log('📦 Creating sellers collection...');

    try {
        // Create collection
        await databases.createCollection(
            DATABASE_ID,
            SELLERS_COLLECTION_ID,
            'Sellers',
            [
                sdk.Permission.read(sdk.Role.users()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
                sdk.Permission.delete(sdk.Role.users()),
            ]
        );
        console.log('✅ Sellers collection created');

        // Create attributes
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'companyName', 255, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'ownerName', 255, true);
        await databases.createEmailAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'email', true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'phone', 20, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'gstNumber', 15, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'businessType', 50, true);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'address', 1000, true);
        await databases.createBooleanAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'setupCompleted', false, false);
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'subscriptionTier', 50, false, 'free');
        await databases.createStringAttribute(DATABASE_ID, SELLERS_COLLECTION_ID, 'subscriptionStatus', 50, false, 'active');

        console.log('✅ Sellers attributes created');

        // Wait for attributes to be available
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create indexes
        await databases.createIndex(DATABASE_ID, SELLERS_COLLECTION_ID, 'email_unique', 'unique', ['email']);
        await databases.createIndex(DATABASE_ID, SELLERS_COLLECTION_ID, 'gst_unique', 'unique', ['gstNumber']);
        await databases.createIndex(DATABASE_ID, SELLERS_COLLECTION_ID, 'business_type', 'key', ['businessType']);

        console.log('✅ Sellers indexes created');
    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️  Sellers collection already exists');
        } else {
            console.error('❌ Error creating sellers collection:', error.message);
            throw error;
        }
    }
}

async function createSellerSettingsCollection() {
    console.log('📦 Creating seller_settings collection...');

    try {
        // Create collection
        await databases.createCollection(
            DATABASE_ID,
            SELLER_SETTINGS_COLLECTION_ID,
            'Seller Settings',
            [
                sdk.Permission.read(sdk.Role.users()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
                sdk.Permission.delete(sdk.Role.users()),
            ]
        );
        console.log('✅ Seller Settings collection created');

        // Create attributes (reduced sizes to stay within limits)
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'sellerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'enabledFields', 5000, false, '[]');
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'customFields', 5000, false, '[]');
        await databases.createBooleanAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'aiImageEnabled', false, true);
        await databases.createBooleanAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'aiDescriptionEnabled', false, true);
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'currency', 10, false, 'INR');
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'taxSettings', 3000, false, '{}');
        await databases.createStringAttribute(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'inventoryAlerts', 2000, false, '{}');

        console.log('✅ Seller Settings attributes created');

        // Wait for attributes to be available
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create indexes
        await databases.createIndex(DATABASE_ID, SELLER_SETTINGS_COLLECTION_ID, 'seller_unique', 'unique', ['sellerId']);

        console.log('✅ Seller Settings indexes created');
    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️  Seller Settings collection already exists');
        } else {
            console.error('❌ Error creating seller_settings collection:', error.message);
            throw error;
        }
    }
}

async function createProductsCollection() {
    console.log('📦 Creating products collection...');

    try {
        // Create collection
        await databases.createCollection(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            'Products',
            [
                sdk.Permission.read(sdk.Role.users()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
                sdk.Permission.delete(sdk.Role.users()),
            ]
        );
        console.log('✅ Products collection created');

        // Create attributes (optimized sizes)
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'sellerId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'description', 2000, false);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'category', 100, false);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'sku', 100, false);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'barcode', 100, false);
        await databases.createFloatAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'costPrice', false, 0);
        await databases.createFloatAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'sellPrice', true);
        await databases.createIntegerAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'stockQuantity', false, 0);
        await databases.createIntegerAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'lowStockThreshold', false, 10);
        await databases.createUrlAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'imageUrl', false);
        await databases.createBooleanAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'aiGeneratedImage', false, false);
        await databases.createBooleanAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'aiGeneratedDescription', false, false);
        await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'additionalFields', 5000, false, '{}');

        console.log('✅ Products attributes created');

        // Wait for attributes to be available
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create indexes
        await databases.createIndex(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'seller_products', 'key', ['sellerId']);
        await databases.createIndex(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'category', 'key', ['category']);
        await databases.createIndex(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'stock_level', 'key', ['stockQuantity']);

        console.log('✅ Products indexes created');
    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️  Products collection already exists');
        } else {
            console.error('❌ Error creating products collection:', error.message);
            throw error;
        }
    }
}

async function main() {
    console.log('🚀 Starting Appwrite Database Setup...\n');
    console.log(`📍 Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
    console.log(`📍 Project: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);
    console.log(`📍 Database: ${DATABASE_ID}\n`);

    try {
        // Create all collections
        await createSellersCollection();
        console.log('');

        await createSellerSettingsCollection();
        console.log('');

        await createProductsCollection();
        console.log('');

        console.log('✅ ✅ ✅ Database setup complete! ✅ ✅ ✅\n');
        console.log('📝 Next steps:');
        console.log('1. Update your .env.local with these collection IDs:');
        console.log(`   APPWRITE_SELLERS_COLLECTION_ID=${SELLERS_COLLECTION_ID}`);
        console.log(`   APPWRITE_SELLER_SETTINGS_COLLECTION_ID=${SELLER_SETTINGS_COLLECTION_ID}`);
        console.log(`   APPWRITE_PRODUCTS_COLLECTION_ID=${PRODUCTS_COLLECTION_ID}`);
        console.log('2. Restart your development server: npm run dev');
        console.log('3. Test registration at http://localhost:3000/register\n');

    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    }
}

// Run the setup
main();
