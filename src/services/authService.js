import api from '../config/api';

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Verify email with OTP
  verifyEmail: async (userId, code) => {
    const response = await api.post('/auth/verify-email', {
      user_id: userId,
      code: code
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    if (response.data.token && response.data.user) {
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
    } else {
      console.warn('Login response missing token or user:', response.data);
    }
    
    return response.data;
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
  }
};
