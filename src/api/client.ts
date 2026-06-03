import axios from 'axios';

// Base API URL pointing to the Go backend
const BASE_URL = 'http://localhost:8001/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hook into requests to insert Authorization Header if token exists in sessionStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('epustaka_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hook into responses to handle authentication errors dynamically
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request! Session may be expired.');
      // Clear local storage and session state
      sessionStorage.removeItem('epustaka_token');
      sessionStorage.removeItem('epustaka_user');
      
      // Dispatch a custom event to notify App.tsx to redirect
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  }
);
