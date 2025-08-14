import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create axios instance with credentials
const api = axios.create({
  baseURL:  'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users/current-user');
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user, message: response.data.message };
      }
      
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      console.error('Login error:', error);
      return { success: false, message };
    } 
  };

  const logout = async () => {
    try {
      await api.get('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/users/create', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data) {
        return { success: true, message: response.data.message, email: response.data.email };
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      console.error('Registration error:', error);
      return { success: false, message };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post('/users/verify-otp', { email, otp });
      
      if (response.data) {
        return { success: true, message: response.data.message };
      }
      
      return { success: false, message: 'OTP verification failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      console.error('OTP verification error:', error);
      return { success: false, message };
    } 
  };

  const resendOtp = async (email) => {
    try {
      const response = await api.post('/users/resend-otp', { email });
      
      if (response.data) {
        return { success: true, message: response.data.message };
      }
      
      return { success: false, message: 'Failed to resend OTP' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      console.error('Resend OTP error:', error);
      return { success: false, message };
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      let response;
      
      // Check if it's FormData (for profile picture)
      if (updatedUserData instanceof FormData) {
        response = await api.post('/users/update-profile-picture', updatedUserData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else if (updatedUserData.username || updatedUserData.fullName) {
        response = await api.post('/users/update-text-details', updatedUserData);
      } else if (updatedUserData.bio !== undefined) {
        response = await api.post('/users/update-bio', updatedUserData);
      } else if (updatedUserData.profilePicture) {
        // Handle object with profilePicture file
        const formData = new FormData();
        formData.append('profilePicture', updatedUserData.profilePicture);
        response = await api.post('/users/update-profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        return { success: false, message: 'No valid update data provided' };
      }

      if (response?.data?.user) {
        setUser(response.data.user);
        return { success: true, user: response.data.user, message: response.data.message };
      }
      
      return { success: false, message: response?.data?.message || 'Update failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      console.error('Update user error:', error);
      return { success: false, message };
    }
  };

  const sendResetPasswordOtp = async (email) => {
    try {
      const response = await api.post('/users/send-otp-for-reset-password', { email });
      
      if (response.data) {
        return { success: true, message: response.data.message };
      }
      
      return { success: false, message: 'Failed to send OTP' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      console.error('Send reset password OTP error:', error);
      return { success: false, message };
    }
  };

  const verifyResetPasswordOtp = async (email, otp) => {
    try {
      const response = await api.post('/users/verify-otp-for-reset-password', { email, otp });
      
      if (response.data) {
        return { success: true, message: response.data.message };
      }
      
      return { success: false, message: 'OTP verification failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      console.error('Verify reset password OTP error:', error);
      return { success: false, message };
    }
  };

  const resetPassword = async (newPassword, confirmPassword) => {
    try {
      const response = await api.post('/users/reset-password', { newPassword, confirmPassword });
      
      if (response.data) {
        return { success: true, message: response.data.message };
      }
      
      return { success: false, message: 'Password reset failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      console.error('Reset password error:', error);
      return { success: false, message };
    }
  };

  const deleteAccount = async (password) => {
    try {
      const response = await api.delete('/users/delete-account', {
        data: { password }
      });
      
      if (response.data) {
        // Clear user data and redirect
        setUser(null);
        setIsAuthenticated(false);
        return { success: true, message: response.data.message };
      }
      
      return { success: false, message: 'Account deletion failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Account deletion failed';
      console.error('Delete account error:', error);
      return { success: false, message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    verifyOtp,
    resendOtp,
    updateUser,
    checkAuthStatus,
    sendResetPasswordOtp,
    verifyResetPasswordOtp,
    resetPassword,
    deleteAccount,
    isLoggedIn: isAuthenticated, // For backward compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { api };