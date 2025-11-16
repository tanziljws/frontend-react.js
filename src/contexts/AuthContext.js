import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = authService.getCurrentUser();
        
        if (token && userData) {
          // Verify token is still valid by making a test request
          // For now, just set user if token and userData exist
          setUser(userData);
        } else {
          // Clear any invalid data
          if (token && !userData) {
            localStorage.removeItem('auth_token');
          }
          if (userData && !token) {
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear invalid auth data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await authService.login(email, password);
      console.log('✅ Login response:', response);
      
      // Verify that we got token and user in response (strict validation)
      if (!response || !response.token || !response.user) {
        console.error('❌ Invalid login response - missing token or user:', {
          hasResponse: !!response,
          hasToken: !!response?.token,
          hasUser: !!response?.user,
          response: response
        });
        return {
          success: false,
          error: response?.message || 'Login gagal: Response tidak valid'
        };
      }
      
      // authService.login() sudah menyimpan token dan user ke localStorage
      // Ambil user dari localStorage untuk memastikan konsistensi
      const savedUser = authService.getCurrentUser();
      console.log('👤 Saved user from localStorage:', savedUser);
      
      if (savedUser && savedUser.id) {
        setUser(savedUser);
        console.log('✅ User set in context:', savedUser);
        return { success: true };
      } else if (response.user && response.user.id) {
        // Fallback: jika localStorage belum tersimpan, gunakan response
        console.warn('⚠️ Using response.user as fallback');
        setUser(response.user);
        // Coba simpan lagi
        if (response.token) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return { success: true };
      } else {
        console.error('❌ No valid user data found in response or localStorage');
        return {
          success: false,
          error: 'Login gagal: Data user tidak ditemukan'
        };
      }
    } catch (error) {
      console.error('❌ Login error caught:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login gagal';
      console.error('❌ Error message:', errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { 
        success: true, 
        message: response.message,
        user_id: response.user_id
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registrasi gagal' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const verifyEmail = async (userId, code) => {
    try {
      const response = await authService.verifyEmail(userId, code);
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Verifikasi gagal' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    verifyEmail,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
