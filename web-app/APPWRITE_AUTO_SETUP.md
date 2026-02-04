# Automated Appwrite Setup

## 🚀 Quick Setup (Automated)

Instead of manually creating collections in the Appwrite Console, you can run our automated setup script!

### Prerequisites

1. Make sure your `.env.local` is configured with:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `APPWRITE_API_KEY`
   - `APPWRITE_DATABASE_ID`

2. Your Appwrite API key must have these permissions:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `attributes.read`
   - `attributes.write`
   - `indexes.read`
   - `indexes.write`

### Run the Setup Script

```bash
npm run setup:appwrite
```

That's it! The script will:
- ✅ Create `sellers` collection with all attributes and indexes
- ✅ Create `seller_settings` collection with all attributes and indexes
- ✅ Create `products` collection with all attributes and indexes
- ✅ Set proper permissions for all collections

### After Setup

1. Update your `.env.local` with the collection IDs (the script will show you):
```env
APPWRITE_SELLERS_COLLECTION_ID=sellers
APPWRITE_SELLER_SETTINGS_COLLECTION_ID=seller_settings
APPWRITE_PRODUCTS_COLLECTION_ID=products
```

2. Restart your development server:
```bash
npm run dev
```

3. Test registration at http://localhost:3000/register

---

## 📋 What Gets Created

### Sellers Collection
- **Attributes**: companyName, ownerName, email, phone, gstNumber, businessType, address, setupCompleted, subscriptionTier, subscriptionStatus
- **Indexes**: email_unique, gst_unique, business_type

### Seller Settings Collection
- **Attributes**: sellerId, enabledFields, customFields, aiImageEnabled, aiDescriptionEnabled, currency, taxSettings, inventoryAlerts
- **Indexes**: seller_unique

### Products Collection
- **Attributes**: sellerId, name, description, category, sku, barcode, costPrice, sellPrice, stockQuantity, lowStockThreshold, imageUrl, aiGeneratedImage, aiGeneratedDescription, additionalFields
- **Indexes**: seller_products, category, stock_level

---

## 🔧 Troubleshooting

### "Collection already exists"
- The script will skip existing collections and continue
- This is safe and expected if you run it multiple times

### "Insufficient permissions"
- Check your API key has all required scopes
- Generate a new API key with full database permissions

### "Database not found"
- Create a database first in Appwrite Console
- Update `APPWRITE_DATABASE_ID` in `.env.local`

---

## 🎯 Manual Setup (Alternative)

If you prefer manual setup or the script fails, see `APPWRITE_SETUP_GUIDE.md` for detailed step-by-step instructions.
