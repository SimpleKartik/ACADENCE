import axios from 'axios';
import { getToken } from './jwt';

/**
 * API base URL - adjust based on your backend URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Create axios instance with default config
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT token to requests
 */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear it
      if (typeof window !== 'undefined') {
        localStorage.removeItem('acadence_token');
        // Redirect to login if not already there
        if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/login/')) {
          window.location.href = '/select-role';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
