import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cookies (for logout)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – no need to add Authorization header here because we set it globally in AuthContext, but we keep it as fallback
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if on admin page
      localStorage.removeItem('adminToken');
      delete api.defaults.headers.common['Authorization'];
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;