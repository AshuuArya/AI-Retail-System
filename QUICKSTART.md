# Quick Start Guide

## Installation (5 minutes)

### 1. Install Dependencies
```bash
cd backend
python -m venv venv

# Activate virtual environment
.\\venv\\Scripts\\activate  # Windows
# OR
source venv/bin/activate    # Mac/Linux

pip install -r requirements.txt
```

> **Note**: First installation downloads AI model (~80MB). Takes 2-5 minutes.

### 2. Seed Database
```bash
python seed_data.py
```

### 3. Start Server
```bash
uvicorn main:app --reload
```

### 4. Access API
- **API Docs**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/health

## Default Login

**Admin:**
- Username: `admin1`
- Password: `admin1pass`

**Test Users:**
- `user1` / `User1Pass123`
- `user2` / `User2Pass123`
- `user3` / `User3Pass123`

## Quick Tests

### 1. Test AI Search
```
GET /api/v1/products?search=good smell
→ Returns perfumes, colognes, fragrances
```

### 2. Test Analytics
```
GET /api/v1/analytics/sales-trends?days=30
→ Returns 30 days of sales data
```

### 3. Test Export
```
GET /api/v1/export/products?format=excel
→ Downloads Excel file
```

### 4. Test Barcode
```
GET /api/v1/products/1/barcode
→ Returns PNG barcode image
```

## Features Overview

✅ **AI-Powered Search** - Semantic product search
✅ **Product Recommendations** - ML-based suggestions
✅ **Advanced Analytics** - 7 analytics endpoints
✅ **Export/Import** - CSV, Excel, PDF
✅ **Barcode/QR Generation** - Product & order codes
✅ **Email Notifications** - Order updates (optional)
✅ **Batch Operations** - Update multiple products
✅ **Health Monitoring** - System status checks

## File Structure

```
backend/
├── main.py                 # Main API (40+ endpoints)
├── config.py               # Configuration management
├── auth.py                 # Authentication
├── database.py             # Database models
├── ai_services.py          # AI/ML features
├── barcode_service.py      # Barcode/QR generation
├── export_service.py       # Export/import logic
├── email_service.py        # Email notifications
├── analytics_service.py    # Business analytics
├── utils.py                # Utility functions
├── seed_data.py            # Database seeding
├── requirements.txt        # Dependencies
└── .env                    # Configuration
```

## Configuration

Edit `.env` to customize:

```env
# Required
SECRET_KEY=your_secret_key_here

# Optional - Email
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_SERVER=smtp.gmail.com

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_BARCODE_GENERATION=true
ENABLE_EXPORT_IMPORT=true
ENABLE_ANALYTICS=true
```

## Troubleshooting

### Import Errors
```bash
# Make sure virtual environment is activated
.\\venv\\Scripts\\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Database Issues
```bash
# Reseed database
python seed_data.py
```

### Port Already in Use
```bash
# Use different port
uvicorn main:app --reload --port 8001
```

## Next Steps

1. ✅ Backend is ready
2. 🔄 Start frontend: `cd frontend && npm start`
3. 🌐 Access app: http://localhost:3000
4. 📚 Read full docs: README.md

## Support

- API Documentation: http://127.0.0.1:8000/docs
- Health Check: http://127.0.0.1:8000/health
- Full README: See README.md
