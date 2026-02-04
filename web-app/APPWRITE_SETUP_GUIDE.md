# Appwrite Database Setup Guide

This guide will walk you through creating all the required collections in your Appwrite database for the AI Retail System.

---

## Prerequisites

- Appwrite Console access: https://cloud.appwrite.io/console
- Your Project ID: Check `.env.local` for `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- Your Database ID: Check `.env.local` for `APPWRITE_DATABASE_ID`

---

## Step 1: Access Your Database

1. Go to https://cloud.appwrite.io/console
2. Select your project
3. Click on **Databases** in the left sidebar
4. Select your database (or create one if you haven't)
5. Note down your **Database ID** and update `.env.local`

---

## Step 2: Create `sellers` Collection

### Collection Settings:
- **Collection ID**: `sellers` (or generate unique ID)
- **Collection Name**: `Sellers`

### Attributes:

| Attribute Key | Type | Size | Required | Default | Array |
|--------------|------|------|----------|---------|-------|
| `companyName` | String | 255 | Yes | - | No |
| `ownerName` | String | 255 | Yes | - | No |
| `email` | Email | 320 | Yes | - | No |
| `phone` | String | 20 | Yes | - | No |
| `gstNumber` | String | 15 | Yes | - | No |
| `businessType` | String | 50 | Yes | - | No |
| `address` | String | 1000 | Yes | - | No |
| `setupCompleted` | Boolean | - | No | false | No |
| `subscriptionTier` | String | 50 | No | free | No |
| `subscriptionStatus` | String | 50 | No | active | No |

### Indexes:

| Index Key | Type | Attributes | Orders |
|-----------|------|------------|--------|
| `email_unique` | Unique | email | ASC |
| `gst_unique` | Unique | gstNumber | ASC |
| `business_type` | Key | businessType | ASC |

### Permissions:
- **Create**: `users`
- **Read**: `users`
- **Update**: `users`
- **Delete**: `users`

---

## Step 3: Create `seller_settings` Collection

### Collection Settings:
- **Collection ID**: `seller_settings` (or generate unique ID)
- **Collection Name**: `Seller Settings`

### Attributes:

| Attribute Key | Type | Size | Required | Default | Array |
|--------------|------|------|----------|---------|-------|
| `sellerId` | String | 255 | Yes | - | No |
| `enabledFields` | String | 10000 | No | [] | No |
| `customFields` | String | 10000 | No | [] | No |
| `aiImageEnabled` | Boolean | - | No | true | No |
| `aiDescriptionEnabled` | Boolean | - | No | true | No |
| `currency` | String | 10 | No | INR | No |
| `taxSettings` | String | 5000 | No | {} | No |
| `inventoryAlerts` | String | 5000 | No | {} | No |

**Note**: For JSON fields (`enabledFields`, `customFields`, `taxSettings`, `inventoryAlerts`), use String type with large size.

### Indexes:

| Index Key | Type | Attributes | Orders |
|-----------|------|------------|--------|
| `seller_unique` | Unique | sellerId | ASC |

### Permissions:
- **Create**: `users`
- **Read**: `users`
- **Update**: `users`
- **Delete**: `users`

---

## Step 4: Create/Update `products` Collection

### Collection Settings:
- **Collection ID**: `products` (or generate unique ID)
- **Collection Name**: `Products`

### Attributes:

| Attribute Key | Type | Size | Required | Default | Array |
|--------------|------|------|----------|---------|-------|
| `sellerId` | String | 255 | Yes | - | No |
| `name` | String | 255 | Yes | - | No |
| `description` | String | 5000 | No | - | No |
| `category` | String | 100 | No | - | No |
| `sku` | String | 100 | No | - | No |
| `barcode` | String | 100 | No | - | No |
| `costPrice` | Float | - | No | 0 | No |
| `sellPrice` | Float | - | Yes | - | No |
| `stockQuantity` | Integer | - | No | 0 | No |
| `lowStockThreshold` | Integer | - | No | 10 | No |
| `imageUrl` | URL | 2000 | No | - | No |
| `aiGeneratedImage` | Boolean | - | No | false | No |
| `aiGeneratedDescription` | Boolean | - | No | false | No |
| `additionalFields` | String | 10000 | No | {} | No |

**Note**: `additionalFields` is a JSON string for flexible custom fields.

### Indexes:

| Index Key | Type | Attributes | Orders |
|-----------|------|------------|--------|
| `seller_products` | Key | sellerId | ASC |
| `seller_sku` | Key | sellerId, sku | ASC, ASC |
| `category` | Key | category | ASC |
| `stock_level` | Key | stockQuantity | ASC |

### Permissions:
- **Create**: `users`
- **Read**: `users`
- **Update**: `users`
- **Delete**: `users`

---

## Step 5: Update Environment Variables

After creating the collections, update your `.env.local` file:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# Server-side only
APPWRITE_API_KEY=your_api_key_here
APPWRITE_DATABASE_ID=your_database_id_here

# Collection IDs (update these with your actual collection IDs)
APPWRITE_SELLERS_COLLECTION_ID=sellers
APPWRITE_SELLER_SETTINGS_COLLECTION_ID=seller_settings
APPWRITE_PRODUCTS_COLLECTION_ID=products

# JWT Secret for token generation
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

---

## Step 6: Restart Your Development Server

After updating `.env.local`, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 7: Test Registration

1. Navigate to http://localhost:3000
2. Click "Register as Seller"
3. Fill out the registration form
4. Submit and verify:
   - Account created in Appwrite Authentication
   - Seller profile created in `sellers` collection
   - Default settings created in `seller_settings` collection
   - Successful redirect to login page

---

## Troubleshooting

### Error: "Collection with the requested ID could not be found"
- **Cause**: Collection ID in `.env.local` doesn't match Appwrite
- **Fix**: Copy the exact Collection ID from Appwrite Console

### Error: "Document with the requested ID already exists"
- **Cause**: Trying to create duplicate seller
- **Fix**: Use a different email or GST number

### Error: "Invalid document structure"
- **Cause**: Missing required attributes in collection
- **Fix**: Verify all required attributes are created

### Error: "Unauthorized"
- **Cause**: Incorrect permissions or API key
- **Fix**: Check permissions are set to `users` and API key is valid

---

## Quick Setup Checklist

- [ ] Access Appwrite Console
- [ ] Create/verify Database
- [ ] Create `sellers` collection with all attributes and indexes
- [ ] Create `seller_settings` collection with all attributes and indexes
- [ ] Create/update `products` collection with all attributes and indexes
- [ ] Update `.env.local` with correct collection IDs
- [ ] Restart development server
- [ ] Test registration flow
- [ ] Verify data appears in Appwrite Console

---

## Collection IDs Reference

After creating collections, you'll have IDs like:

```
sellers → 6789abcd1234efgh5678
seller_settings → 1234abcd5678efgh9012
products → 5678efgh9012abcd3456
```

Copy these exact IDs into your `.env.local` file.

---

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Next.js server terminal for API errors
3. Verify all environment variables are set correctly
4. Ensure Appwrite API key has proper permissions
5. Check Appwrite Console → Databases → Your Database → Collections

---

**Once setup is complete, your registration flow will work end-to-end!**
