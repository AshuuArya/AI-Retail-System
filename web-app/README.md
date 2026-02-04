# AI Retail System

A comprehensive retail management system built with Next.js, React, and Appwrite, featuring AI-powered product management, inventory tracking, customer management, and sales analytics.

## 🚀 Features

### Core Functionality
- ✅ **Product Management**: Add, edit, delete products with bulk operations
- ✅ **Inventory Tracking**: Real-time stock monitoring with low stock alerts
- ✅ **Customer Management**: Complete customer database with purchase history
- ✅ **Sales & Invoicing**: Generate invoices, track sales, payment processing
- ✅ **Analytics Dashboard**: Sales trends, top products, revenue insights
- ✅ **Data Export**: Export products and customers to CSV

### Advanced Features
- 🤖 **AI Integration**: Auto-fill product details using Gemini AI
- 📱 **Barcode Scanning**: Mobile barcode/QR code scanner
- 🔍 **Search & Filters**: Real-time search with debouncing
- 🌙 **Dark Mode**: Full dark mode support
- 📊 **Bulk Operations**: Select and delete multiple items
- 💾 **Offline Support**: PWA with offline capabilities

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **TypeScript**: Full type safety

### Backend
- **Database**: Appwrite (Cloud/Self-hosted)
- **Authentication**: Appwrite Auth
- **File Storage**: Appwrite Storage
- **Real-time**: Appwrite Realtime

### AI & Utilities
- **AI**: Google Gemini AI (with OpenAI fallback)
- **Barcode**: html5-qrcode
- **Security**: bcryptjs, jsonwebtoken

## 📁 Project Structure

```
web-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── inventory/      # Product management
│   │   │   ├── customers/      # Customer management
│   │   │   ├── sales/          # Sales & invoicing
│   │   │   └── analytics/      # Analytics & reports
│   │   ├── api/                # API routes
│   │   └── (auth)/             # Authentication pages
│   ├── components/             # React components
│   │   ├── inventory/          # Product components
│   │   ├── customers/          # Customer components
│   │   ├── invoices/           # Invoice components
│   │   ├── mobile/             # Mobile-specific components
│   │   └── ui/                 # Reusable UI components
│   ├── contexts/               # React Context providers
│   ├── hooks/                  # Custom React hooks
│   ├── infrastructure/         # Appwrite configuration
│   └── lib/                    # Utility functions
├── public/                     # Static assets
└── scripts/                    # Setup scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Appwrite account (cloud or self-hosted)
- Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   cd ai-retail-system/web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   
   # Gemini AI (Optional)
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Appwrite**
   ```bash
   npm run setup:appwrite
   ```
   
   This will create all necessary databases, collections, and attributes.

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### First Time Setup
1. Register a new account at `/register`
2. Login at `/login`
3. Complete your business profile
4. Start adding products and customers

### Key Workflows

#### Adding Products
1. Navigate to **Inventory** → **Add Product**
2. Fill in product details or use AI auto-fill
3. Set pricing, stock levels, and low stock threshold
4. Save product

#### Managing Customers
1. Go to **Customers** → **Add Customer**
2. Enter customer information
3. Track purchase history automatically

#### Creating Invoices
1. Navigate to **Sales** → **New Invoice**
2. Select customer and add products
3. Choose payment method
4. Generate and save invoice

#### Bulk Operations
1. Select multiple products using checkboxes
2. Click "Delete Selected" for bulk deletion
3. Or use "Select All" to select all items

#### Exporting Data
1. Click "Export CSV" button on Inventory or Customers page
2. CSV file downloads automatically with current date

## 🔧 Configuration

### Appwrite Setup
See [APPWRITE_SETUP_GUIDE.md](./APPWRITE_SETUP_GUIDE.md) for detailed instructions.

### AI Features
- **Gemini AI**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **OpenAI** (alternative): Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup:appwrite` - Set up Appwrite collections

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## 📱 PWA Features
- Offline support
- Install as app
- Service worker caching
- Mobile-optimized UI

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

## 🆘 Support
For issues and questions:
1. Check existing documentation
2. Review [APPWRITE_FIX_GUIDE.md](./APPWRITE_FIX_GUIDE.md) for common issues
3. Create an issue on GitHub

## 🎯 Roadmap
- [ ] Multi-store support
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Supplier management

---

**Built with ❤️ using Next.js and Appwrite**
