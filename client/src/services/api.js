import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE, withCredentials: false });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('at_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('at_token');
      localStorage.removeItem('at_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login:          (id, password, role) => api.post('/auth/login', { id, password, role }),
  register:       (name, email, password) => api.post('/auth/register', { name, email, password }),
  me:             () => api.get('/auth/me'),
  updateProfile:  (data) => api.patch('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const attendanceAPI = {
  markPresent: () => api.post('/attendance/present'),
  markLeave:   () => api.post('/attendance/leave'),
  getToday:    (date) => api.get('/attendance/today', { params: { date } }),
  getStats:    (date) => api.get('/attendance/stats', { params: { date } }),
  getHistory:  (studentId) => api.get(`/attendance/student/${studentId}`),
};

export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getOne: (id) => api.get(`/students/${id}`),
};

export const uploadAPI = {
  uploadClassList: (formData, onProgress) =>
    api.post('/upload/classlist', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  getHistory: () => api.get('/upload/history'),
};

export const exportAPI = {
  excel: (date) => api.get('/export/excel', { params: { date }, responseType: 'blob' }),
  pdf:   (date) => api.get('/export/pdf',   { params: { date }, responseType: 'blob' }),
};

export default api;
