# 🔧 Fixing "Project is not accessible in this region" Error

## Problem
You're seeing this error when trying to add products because your Appwrite database and collection IDs in `.env.local` are placeholder values that don't match your actual Appwrite project.

## Solution: Get Correct IDs from Appwrite Console

### Step 1: Open Appwrite Console
1. Go to https://cloud.appwrite.io/console
2. Select your project: **696e71d90035b6724f6c**

### Step 2: Get Database ID
1. In the left sidebar, click on **"Databases"**
2. You should see your database (might be named "retail_db" or similar)
3. Click on the database name
4. **Copy the Database ID** from the URL or the database settings
   - It looks like: `696e730600050b1c0775` (you already have this!)

### Step 3: Create/Get Products Collection ID
1. Inside your database, look for a collection named **"products"**
2. If it doesn't exist, create it:
   - Click **"Create Collection"**
   - Name it: `products`
   - Click **"Create"**
3. Click on the products collection
4. **Copy the Collection ID** from the URL or collection settings
   - It will be a string like: `67a1b2c3d4e5f6789012`

### Step 4: Create Collection Attributes
If you just created the collection, you need to add these attributes:

**Required Attributes:**
- `name` (String, required, size: 255)
- `description` (String, optional, size: 1000)
- `category` (String, optional, size: 100)
- `price` (Float, required)
- `quantity` (Integer, required)
- `shopId` (String, required, size: 100)
- `imageUrl` (String, optional, size: 500)
- `createdAt` (String, optional, size: 50)
- `updatedAt` (String, optional, size: 50)

**Create Indexes:**
- Index on `shopId` (key: `shopId_idx`, type: key, attributes: [`shopId`])
- Index on `name` (key: `name_idx`, type: fulltext, attributes: [`name`])
- Index on `description` (key: `desc_idx`, type: fulltext, attributes: [`description`])

### Step 5: Update .env.local
Replace the placeholder IDs in your `.env.local` file:

```bash
# Current (WRONG):
APPWRITE_DATABASE_ID=696e730600050b1c0775
APPWRITE_PRODUCTS_COLLECTION_ID=products_table_id  # ❌ This is wrong!
APPWRITE_ORDERS_COLLECTION_ID=products_table_id    # ❌ This is wrong!

# Updated (CORRECT):
APPWRITE_DATABASE_ID=696e730600050b1c0775
APPWRITE_PRODUCTS_COLLECTION_ID=YOUR_ACTUAL_COLLECTION_ID_HERE  # ✅ Get from Appwrite Console
APPWRITE_ORDERS_COLLECTION_ID=YOUR_ORDERS_COLLECTION_ID_HERE    # ✅ Create orders collection too
```

### Step 6: Restart Development Server
After updating `.env.local`:
1. Stop the dev server (Ctrl+C in terminal)
2. Restart it: `npm run dev`
3. Try adding a product again

## Quick Fix Commands

```bash
# 1. Stop the server
# Press Ctrl+C in the terminal running npm run dev

# 2. Edit .env.local file
# Replace APPWRITE_PRODUCTS_COLLECTION_ID with your actual collection ID

# 3. Restart server
npm run dev
```

## Still Getting Errors?

### Check Your Appwrite Region
If you're still seeing region errors, your project might be in a specific region. Try these endpoints in `.env.local`:

```bash
# Try EU endpoint:
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://eu.cloud.appwrite.io/v1

# Or US endpoint:
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://us.cloud.appwrite.io/v1

# Or keep global:
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

### Verify API Key Permissions
Make sure your API key has the correct permissions:
1. Go to Appwrite Console → Settings → API Keys
2. Find your API key
3. Ensure it has these scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `documents.read`
   - `documents.write`

## Need Help?
If you're still stuck, share:
1. The exact error message
2. Your database ID
3. Your collection ID
4. Screenshot of your Appwrite database structure
