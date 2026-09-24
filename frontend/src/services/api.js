import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aiia_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Standardized error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected network error occurred.';
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('aiia_token');
        localStorage.removeItem('aiia_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      message = error.response.data?.message || `Server responded with error status ${error.response.status}`;
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      message = 'The AI service took too long to respond. Please try again.';
    } else if (error.request) {
      message = 'Cannot connect to AIIA Backend server. Please check that the API server is running on Port 5000.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
