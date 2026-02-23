import axios from 'axios';

// In production, use VITE_BACKEND_URL. In dev, use Vite proxy.
const BASE_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : '/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach token from localStorage automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ft_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ft_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const transactionAPI = {
  getAll: (params) => api.get('/transactions/', { params }),
  create: (data) => api.post('/transactions/', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getByCategory: () => api.get('/analytics/by-category'),
  getMonthly: () => api.get('/analytics/monthly'),
};

export const aiAPI = {
  getInsights: () => api.get('/ai/insights'),
  ask: (question) => api.post('/ai/ask', { question }),
};

export default api;
