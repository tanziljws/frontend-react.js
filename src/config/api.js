import axios from 'axios';

// Base URL backend Laravel - menggunakan environment variable atau fallback ke Railway
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://laravel-event-app-production-447f.up.railway.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Enable untuk session cookies
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan redirect jika ini adalah request login (untuk menghindari loop)
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      // Token expired atau invalid (kecuali untuk login endpoint)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Hanya redirect jika tidak di halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
