import api from '../config/api';

export const authService = {
  // Register user
  register: async (userData) => {
    console.log('📤 Sending register request to API...', userData);
    try {
      const response = await api.post('/auth/register', userData);
      console.log('📥 Register API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Register API error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  },

  // Verify email with OTP (tidak perlu userId, pakai session)
  verifyEmail: async (code) => {
    const response = await api.post('/auth/verify-email', {
      code: code
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      // Check if response is successful and has token/user
      if (response.data && response.data.token && response.data.user) {
        // Simpan token
        localStorage.setItem('auth_token', response.data.token);
        // Simpan user data dengan error handling
        try {
          const userData = JSON.stringify(response.data.user);
          localStorage.setItem('user', userData);
          console.log('User data saved to localStorage:', response.data.user);
        } catch (error) {
          console.error('Error saving user to localStorage:', error);
        }
        return response.data;
      } else {
        // No token/user means login failed
        throw new Error(response.data?.message || 'Login gagal');
      }
    } catch (error) {
      // Clear any existing auth data on error
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Re-throw error with message from backend
      const errorMessage = error.response?.data?.message || error.message || 'Login gagal';
      const customError = new Error(errorMessage);
      customError.response = error.response;
      throw customError;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        console.log('User loaded from localStorage:', parsedUser);
        return parsedUser;
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Request password reset
  requestReset: async (email) => {
    const response = await api.post('/auth/request-reset', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (userId, code, password, passwordConfirmation) => {
    const response = await api.post('/auth/reset-password', {
      user_id: userId,
      code,
      password,
      password_confirmation: passwordConfirmation
    });
    return response.data;
  },

  // Flexible reset password: accept email or userId
  resetPasswordFlexible: async ({ userId, email, code, password, passwordConfirmation }) => {
    const payload = {
      code,
      password,
      password_confirmation: passwordConfirmation,
    };
    if (email) payload.email = email;
    if (userId) payload.user_id = userId;
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  },

  // Resend OTP for email verification (tidak perlu userId, pakai session)
  resendOtp: async () => {
    const response = await api.post('/auth/resend-otp');
    return response.data;
  }
};
