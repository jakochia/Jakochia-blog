import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify the token by fetching admin data
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const res = await api.get('/admin/auth/me');
      setAdmin(res.data.admin);
    } catch (error) {
      // Token is invalid or expired – clear storage
      localStorage.removeItem('adminToken');
      delete api.defaults.headers.common['Authorization'];
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/admin/auth/login', { email, password });
      if (res.data.success) {
        const token = res.data.token;
        // Save token
        localStorage.setItem('adminToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, error: res.data.error };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};