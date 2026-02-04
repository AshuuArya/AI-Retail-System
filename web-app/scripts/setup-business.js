/**
 * Appwrite Business Collections Setup Script
 * Creates customers and invoices collections
 */
require('dotenv').config({ path: '.env.local' });
const sdk = require('node-appwrite');

// Configuration
const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const CUSTOMERS_COLLECTION_ID = 'customers';
const INVOICES_COLLECTION_ID = 'invoices';

async function createCustomersCollection() {
    console.log('📦 Creating customers collection...');

    try {
        await databases.createCollection(
            DATABASE_ID,
            CUSTOMERS_COLLECTION_ID,
            'Customers',
            [
                sdk.Permission.read(sdk.Role.users()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
                sdk.Permission.delete(sdk.Role.users()),
            ]
        );
        console.log('✅ Customers collection created');

        // Add attributes
        const attributes = [
            { name: 'sellerId', type: 'string', size: 100, required: true },
            { name: 'name', type: 'string', size: 200, required: true },
            { name: 'email', type: 'string', size: 255, required: false },
            { name: 'phone', type: 'string', size: 20, required: false },
            { name: 'address', type: 'string', size: 500, required: false },
            { name: 'city', type: 'string', size: 100, required: false },
            { name: 'state', type: 'string', size: 100, required: false },
            { name: 'pincode', type: 'string', size: 10, required: false },
            { name: 'gstNumber', type: 'string', size: 50, required: false },
            { name: 'totalPurchases', type: 'integer', required: false },
            { name: 'totalSpent', type: 'float', required: false },
            { name: 'lastPurchaseDate', type: 'string', size: 50, required: false },
        ];

        for (const attr of attributes) {
            if (attr.type === 'string') {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    CUSTOMERS_COLLECTION_ID,
                    attr.name,
                    attr.size,
                    attr.required
                );
            } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(
                    DATABASE_ID,
                    CUSTOMERS_COLLECTION_ID,
                    attr.name,
                    attr.required
                );
            } else if (attr.type === 'float') {
                await databases.createFloatAttribute(
                    DATABASE_ID,
                    CUSTOMERS_COLLECTION_ID,
                    attr.name,
                    attr.required
                );
            }
            console.log(`  ✓ Added ${attr.name} attribute`);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Create indexes
        await databases.createIndex(
            DATABASE_ID,
            CUSTOMERS_COLLECTION_ID,
            'seller_index',
            'key',
            ['sellerId']
        );
        console.log('  ✓ Created seller index');

    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️  Customers collection already exists');
        } else {
            console.error('❌ Error creating customers collection:', error.message);
            throw error;
        }
    }
}

async function createInvoicesCollection() {
    console.log('📦 Creating invoices collection...');

    try {
        await databases.createCollection(
            DATABASE_ID,
            INVOICES_COLLECTION_ID,
            'Invoices',
            [
                sdk.Permission.read(sdk.Role.users()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
                sdk.Permission.delete(sdk.Role.users()),
            ]
        );
        console.log('✅ Invoices collection created');

        // Add attributes
        const attributes = [
            { name: 'sellerId', type: 'string', size: 100, required: true },
            { name: 'customerId', type: 'string', size: 100, required: false },
            { name: 'customerName', type: 'string', size: 200, required: true },
            { name: 'invoiceNumber', type: 'string', size: 50, required: true },
            { name: 'invoiceDate', type: 'string', size: 50, required: true },
            { name: 'items', type: 'string', size: 10000, required: true },
            { name: 'subtotal', type: 'float', required: true },
            { name: 'tax', type: 'float', required: false },
            { name: 'discount', type: 'float', required: false },
            { name: 'total', type: 'float', required: true },
            { name: 'paymentMethod', type: 'string', size: 50, required: false },
            { name: 'paymentStatus', type: 'string', size: 50, required: false },
            { name: 'status', type: 'string', size: 50, required: false },
            { name: 'notes', type: 'string', size: 1000, required: false },
        ];

        for (const attr of attributes) {
            if (attr.type === 'string') {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    INVOICES_COLLECTION_ID,
                    attr.name,
                    attr.size,
                    attr.required
                );
            } else if (attr.type === 'float') {
                await databases.createFloatAttribute(
                    DATABASE_ID,
                    INVOICES_COLLECTION_ID,
                    attr.name,
                    attr.required
                );
            }
            console.log(`  ✓ Added ${attr.name} attribute`);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Create indexes
        await databases.createIndex(
            DATABASE_ID,
            INVOICES_COLLECTION_ID,
            'seller_index',
            'key',
            ['sellerId']
        );
        console.log('  ✓ Created seller index');

        await databases.createIndex(
            DATABASE_ID,
            INVOICES_COLLECTION_ID,
            'customer_index',
            'key',
            ['customerId']
        );
        console.log('  ✓ Created customer index');

    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️  Invoices collection already exists');
        } else {
            console.error('❌ Error creating invoices collection:', error.message);
            throw error;
        }
    }
}

async function main() {
    console.log('🚀 Setting up Business Collections...\n');

    try {
        await createCustomersCollection();
        await createInvoicesCollection();

        console.log('\n✅ All business collections created successfully!');
        console.log('\n📝 Update your .env.local with:');
        console.log(`APPWRITE_CUSTOMERS_COLLECTION_ID=${CUSTOMERS_COLLECTION_ID}`);
        console.log(`APPWRITE_INVOICES_COLLECTION_ID=${INVOICES_COLLECTION_ID}`);
    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    }
}

main();
