# How to Get Your API Keys

This guide will help you obtain all the necessary API keys for the AI Retail System.

## 1. Appwrite Setup (Required)

### Step 1: Create Account
1. Go to [https://cloud.appwrite.io/](https://cloud.appwrite.io/)
2. Click "Sign Up" and create a free account
3. Verify your email

### Step 2: Create Project
1. Click "Create Project"
2. Name it "AI Retail System"
3. Copy the **Project ID** → Use for `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
4. The endpoint is: `https://cloud.appwrite.io/v1` → Use for `NEXT_PUBLIC_APPWRITE_ENDPOINT`

### Step 3: Create API Key
1. Go to "Settings" → "API Keys"
2. Click "Create API Key"
3. Name: "Server Key"
4. Scopes: Select ALL scopes
5. Expiration: Never
6. Copy the key → Use for `APPWRITE_API_KEY`

### Step 4: Create Database
1. Go to "Databases" → "Create Database"
2. Name: "retail_db"
3. Copy Database ID → Use for `APPWRITE_DATABASE_ID`

### Step 5: Create Collections
Create these collections in your database:

**Products Collection:**
- Name: "products"
- Copy Collection ID → Use for `APPWRITE_PRODUCTS_COLLECTION_ID`
- Attributes:
  - `name` (string, 255, required)
  - `description` (string, 1000)
  - `category` (string, 100)
  - `price` (float, required)
  - `quantity` (integer, required)
  - `imageUrl` (string, 500)
  - `shopId` (string, 100, required)

**Orders Collection:**
- Name: "orders"
- Copy Collection ID → Use for `APPWRITE_ORDERS_COLLECTION_ID`
- Attributes:
  - `customerId` (string, 100, required)
  - `items` (string, 5000, required) // JSON array
  - `total` (float, required)
  - `status` (string, 50, required)
  - `shopId` (string, 100, required)

## 2. AI Provider Setup (Choose ONE)

### Option A: OpenAI (Recommended)

1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Name it "AI Retail System"
6. Copy the key → Use for `OPENAI_API_KEY`
7. Set `AI_PROVIDER=openai` in your `.env.local`

**Pricing:** ~$0.15 per 1M tokens (very affordable)

### Option B: Google Gemini (Free Tier)

1. Go to [https://makersuite.google.com/](https://makersuite.google.com/)
2. Sign in with Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key → Use for `GOOGLE_AI_API_KEY`
6. Set `AI_PROVIDER=gemini` in your `.env.local`

**Pricing:** Free tier: 15 requests/minute

## 3. Optional: Stripe (For Payments)

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Create account
3. Go to "Developers" → "API Keys"
4. Copy "Publishable key" → Use for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Copy "Secret key" → Use for `STRIPE_SECRET_KEY`
6. Set `ENABLE_PAYMENTS=true` in your `.env.local`

## 4. Optional: Cloudinary (For Images)

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Create free account
3. Go to Dashboard
4. Copy "Cloud Name" → Use for `CLOUDINARY_CLOUD_NAME`
5. Copy "API Key" → Use for `CLOUDINARY_API_KEY`
6. Copy "API Secret" → Use for `CLOUDINARY_API_SECRET`

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in at minimum:
   - All Appwrite variables (required)
   - One AI provider (OpenAI or Gemini)
   - JWT_SECRET (generate random string)

3. Generate JWT Secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Test your setup:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Appwrite Connection Issues
- Verify Project ID is correct
- Check API key has all scopes enabled
- Ensure endpoint is `https://cloud.appwrite.io/v1`

### AI Provider Issues
- OpenAI: Check you have credits in your account
- Gemini: Ensure API is enabled in Google Cloud Console

### Need Help?
Check the main README.md for detailed documentation.
