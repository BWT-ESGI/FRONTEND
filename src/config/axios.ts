import axios from 'axios';

const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || 'https://api-bwt.thomasgllt.fr'
  : import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;