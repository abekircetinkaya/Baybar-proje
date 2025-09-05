import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    } else if (error.response?.status === 403) {
      toast.error('Bu işlem için yetkiniz bulunmuyor');
    } else if (error.response?.status >= 500) {
      toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.');
    } else if (!error.response) {
      toast.error('Ağ hatası. İnternet bağlantınızı kontrol edin.');
    }

    return Promise.reject(error);
  }
);

// API methods
export const apiMethods = {
  // Content
  getContent: (pageName) => api.get(`/content/${pageName}`),
  updateContent: (pageName, data) => api.put(`/content/${pageName}`, data),
  getAllContent: () => api.get('/content'),

  // Partners
  getPartners: () => api.get('/partners'),
  createPartner: (data) => api.post('/partners', data),
  updatePartner: (id, data) => api.put(`/partners/${id}`, data),
  deletePartner: (id) => api.delete(`/partners/${id}`),

  // Contact
  submitContact: (data) => api.post('/contact', data),
  getContacts: (params) => api.get('/contact', { params }),
  updateContactStatus: (id, data) => api.put(`/contact/${id}`, data),

  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export { api };
export default api;
