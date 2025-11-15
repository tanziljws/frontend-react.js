# 🚀 Setup Frontend untuk Connect ke Backend Railway

## ✅ Perubahan yang Sudah Dilakukan

1. **Update `src/config/api.js`**
   - Menggunakan environment variable `REACT_APP_API_BASE_URL`
   - Fallback ke Railway URL: `https://laravel-event-app-production-447f.up.railway.app/api`

2. **Update semua file yang hardcode localhost:**
   - ✅ `src/services/api.js` - menggunakan config dari `config/api.js`
   - ✅ `src/pages/admin/AdminParticipants.js` - menggunakan `API_BASE_URL`
   - ✅ `src/pages/admin/AdminMessages.js` - menggunakan `API_BASE_URL`
   - ✅ `src/pages/admin/AdminDashboard.js` - menggunakan `API_BASE_URL`
   - ✅ `src/pages/Contact.js` - menggunakan `API_BASE_URL`

## 📝 Setup Environment Variable

### Untuk Development (Local)
Buat file `.env` di root folder `frontend-react.js/`:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
REACT_APP_MIDTRANS_CLIENT_KEY=SB-Mid-client-baNhlx1BONirl1UQ
```

### Untuk Production (Railway/Deploy)
Buat file `.env` atau set environment variable:

```env
REACT_APP_API_BASE_URL=https://laravel-event-app-production-447f.up.railway.app/api
REACT_APP_MIDTRANS_CLIENT_KEY=SB-Mid-client-baNhlx1BONirl1UQ
```

## 🚀 Cara Menjalankan

### Development
```bash
cd frontend-react.js
npm install
npm start
```

Frontend akan berjalan di `http://localhost:3000` dan connect ke backend Railway.

### Production Build
```bash
cd frontend-react.js
npm install
npm run build
```

Build files akan ada di folder `build/` yang siap untuk di-deploy.

## 📦 Deploy Options

### 1. Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Atau connect GitHub repository ke Vercel dan set environment variables di dashboard.

### 2. Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 3. Railway
- Connect GitHub repository
- Set build command: `npm run build`
- Set start command: `npx serve -s build`
- Set environment variables di Railway dashboard

## ⚙️ Environment Variables yang Diperlukan

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | `https://laravel-event-app-production-447f.up.railway.app/api` |
| `REACT_APP_MIDTRANS_CLIENT_KEY` | Midtrans Client Key | `SB-Mid-client-xxxxx` |

## 🔍 Verifikasi Setup

Setelah setup, cek di browser console (F12):
```javascript
console.log(process.env.REACT_APP_API_BASE_URL);
// Should show: https://laravel-event-app-production-447f.up.railway.app/api
```

## 📝 Notes

- Semua API calls sekarang menggunakan `API_BASE_URL` dari `config/api.js`
- Environment variable `REACT_APP_API_BASE_URL` akan override default Railway URL
- Jika tidak set environment variable, akan menggunakan Railway URL sebagai fallback
- Pastikan backend Railway sudah running dan accessible

