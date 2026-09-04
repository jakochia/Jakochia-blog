// ============================================================
// FRONTEND src/context/AuthContext.jsx
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, removeAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAuthToken(token);
      fetchAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await api.get('/admin/auth/me');
      setAdmin(res.data.admin);
    } catch (error) {
      console.error('Auth error:', error);
      localStorage.removeItem('adminToken');
      removeAuthToken();
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/admin/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('adminToken', res.data.token);
      setAuthToken(res.data.token);
      setAdmin(res.data.admin);
      return { success: true };
    }
    return { success: false, error: res.data.error };
  };

  const logout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('adminToken');
    removeAuthToken();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
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

export default AuthContext;
