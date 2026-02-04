require('dotenv').config({ path: '.env.local' });
const sdk = require('node-appwrite');

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = process.env.APPWRITE_PRODUCTS_COLLECTION_ID || 'products';
const CATEGORIES_COLLECTION_ID = 'categories';

async function setupInventoryCollections() {
    console.log('🚀 Setting up Inventory Collections...\n');

    try {
        // Create Products Collection
        await createProductsCollection();

        // Create Categories Collection
        await createCategoriesCollection();

        console.log('\n✅ All inventory collections created successfully!');
        console.log('\n📝 Update your .env.local with:');
        console.log(`APPWRITE_PRODUCTS_COLLECTION_ID=${PRODUCTS_COLLECTION_ID}`);
        console.log(`APPWRITE_CATEGORIES_COLLECTION_ID=${CATEGORIES_COLLECTION_ID}`);

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

async function createProductsCollection() {
    console.log('📦 Creating products collection...');

    try {
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

        // Add attributes
        const attributes = [
            { name: 'sellerId', type: 'string', size: 100, required: true },
            { name: 'name', type: 'string', size: 200, required: true },
            { name: 'description', type: 'string', size: 2000, required: false },
            { name: 'category', type: 'string', size: 100, required: false },
            { name: 'price', type: 'float', required: true },
            { name: 'costPrice', type: 'float', required: false },
            { name: 'stock', type: 'integer', required: true },
            { name: 'lowStockThreshold', type: 'integer', required: false },
            { name: 'barcode', type: 'string', size: 100, required: false },
            { name: 'sku', type: 'string', size: 100, required: false },
            { name: 'images', type: 'string', size: 5000, required: false, array: true },
            { name: 'unit', type: 'string', size: 50, required: false },
            { name: 'brand', type: 'string', size: 100, required: false },
            { name: 'tags', type: 'string', size: 1000, required: false, array: true },
            { name: 'isActive', type: 'boolean', required: true },
        ];

        for (const attr of attributes) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (attr.type === 'string') {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    PRODUCTS_COLLECTION_ID,
                    attr.name,
                    attr.size,
                    attr.required,
                    undefined,
                    attr.array || false
                );
            } else if (attr.type === 'float') {
                await databases.createFloatAttribute(
                    DATABASE_ID,
                    PRODUCTS_COLLECTION_ID,
                    attr.name,
                    attr.required
                );
            } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(
                    DATABASE_ID,
                    PRODUCTS_COLLECTION_ID,
                    attr.name,
                    attr.required
                );
            } else if (attr.type === 'boolean') {
                await databases.createBooleanAttribute(
                    DATABASE_ID,
                    PRODUCTS_COLLECTION_ID,
                    attr.name,
                    attr.required
                );
            }
            console.log(`  ✓ Added ${attr.name} attribute`);
        }

        // Create indexes
        await new Promise(resolve => setTimeout(resolve, 2000));
        await databases.createIndex(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            'seller_idx',
            'key',
            ['sellerId']
        );
        console.log('  ✓ Created seller index');

        await databases.createIndex(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            'category_idx',
            'key',
            ['category']
        );
        console.log('  ✓ Created category index');

    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️  Products collection already exists');
        } else {
            throw error;
        }
    }
}

async function createCategoriesCollection() {
    console.log('\n📁 Creating categories collection...');

    try {
        await databases.createCollection(
            DATABASE_ID,
            CATEGORIES_COLLECTION_ID,
            'Categories',
            [
                sdk.Permission.read(sdk.Role.users()),
                sdk.Permission.create(sdk.Role.users()),
                sdk.Permission.update(sdk.Role.users()),
                sdk.Permission.delete(sdk.Role.users()),
            ]
        );
        console.log('✅ Categories collection created');

        // Add attributes
        const attributes = [
            { name: 'sellerId', type: 'string', size: 100, required: true },
            { name: 'name', type: 'string', size: 100, required: true },
            { name: 'description', type: 'string', size: 500, required: false },
            { name: 'icon', type: 'string', size: 50, required: false },
            { name: 'color', type: 'string', size: 20, required: false },
        ];

        for (const attr of attributes) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            await databases.createStringAttribute(
                DATABASE_ID,
                CATEGORIES_COLLECTION_ID,
                attr.name,
                attr.size,
                attr.required
            );
            console.log(`  ✓ Added ${attr.name} attribute`);
        }

        // Create index
        await new Promise(resolve => setTimeout(resolve, 2000));
        await databases.createIndex(
            DATABASE_ID,
            CATEGORIES_COLLECTION_ID,
            'seller_idx',
            'key',
            ['sellerId']
        );
        console.log('  ✓ Created seller index');

    } catch (error) {
        if (error.code === 409) {
            console.log('⚠️  Categories collection already exists');
        } else {
            throw error;
        }
    }
}

setupInventoryCollections();
