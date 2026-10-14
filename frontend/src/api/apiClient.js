import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jeevansetu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap standardized ApiResponse or catch errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        console.warn('Unauthorized session. Please login again.');
      }
      return Promise.reject(data || { message: 'An unexpected server error occurred.' });
    } else if (error.request) {
      return Promise.reject({
        message: 'Backend or network server unreachable. Please verify Spring Boot is running on port 8080.',
      });
    } else {
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiClient;
