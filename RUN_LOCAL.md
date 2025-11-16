# 🚀 Cara Run Frontend di Local

## Prerequisites
- Node.js (v16 atau lebih baru)
- npm atau yarn

## Step-by-Step

### 1. Install Dependencies (jika belum)
```bash
cd frontend-react.js
npm install
```

### 2. Setup Environment Variable

Buat atau update file `.env` di folder `frontend-react.js/`:

**Untuk connect ke backend local (Laravel di localhost:8000):**
```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
REACT_APP_MIDTRANS_CLIENT_KEY=SB-Mid-client-baNhlx1BONirl1UQ
```

**Untuk connect ke backend Railway (production):**
```env
REACT_APP_API_BASE_URL=https://laravel-event-app-production-447f.up.railway.app/api
REACT_APP_MIDTRANS_CLIENT_KEY=SB-Mid-client-baNhlx1BONirl1UQ
```

### 3. Start Development Server
```bash
npm start
```

Frontend akan berjalan di: **http://localhost:3000**

### 4. Pastikan Backend Running

**Jika menggunakan backend local:**
```bash
# Di terminal lain, jalankan Laravel backend
cd laravel-event-app
php artisan serve
```

Backend akan berjalan di: **http://127.0.0.1:8000**

## Troubleshooting

### Port 3000 sudah digunakan?
```bash
# Set port lain
PORT=3001 npm start
```

### Error "Cannot find module"
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
- Pastikan backend Laravel sudah running
- Pastikan CORS config di backend sudah benar
- Cek `.env` file apakah `REACT_APP_API_BASE_URL` sudah benar

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build untuk production
npm run build

# Run tests
npm test
```

