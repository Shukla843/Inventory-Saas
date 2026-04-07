import axios from 'axios';

/**
 * Axios instance configured for API calls
 * withCredentials: true allows sending cookies with requests
 */
const api = axios.create({
  baseURL: '/api', // Proxy handles this in dev, direct in production
  withCredentials: true, // Important: Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (can add loading states, etc.)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors globally)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
