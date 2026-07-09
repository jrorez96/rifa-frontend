import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_URL}/api`
});

// Adjunta el token del admin automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const API_BASE = API_URL;

// --- Endpoints públicos ---
export const getNumbers = () => api.get('/numbers').then(r => r.data);
export const getSettings = () => api.get('/numbers/settings').then(r => r.data);
export const createOrder = (payload) => api.post('/orders', payload).then(r => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then(r => r.data);
export const uploadProof = (orderId, file) => {
  const formData = new FormData();
  formData.append('proof', file);
  // OJO: no fijar manualmente 'Content-Type': 'multipart/form-data' aquí.
  // Sin el "boundary" que el navegador agrega automáticamente, el servidor
  // (multer) no puede separar los campos del archivo y req.file llega vacío
  // — por eso el comprobante se guardaba como NULL sin ningún error visible.
  return api.post(`/orders/${orderId}/proof`, formData).then(r => r.data);
};

// --- Endpoints de admin ---
export const adminLogin = (username, password) =>
  api.post('/admin/login', { username, password }).then(r => r.data);
export const listOrders = (status = 'pending') =>
  api.get(`/admin/orders?status=${status}`).then(r => r.data);
export const confirmOrder = (id) => api.patch(`/admin/orders/${id}/confirm`).then(r => r.data);
export const rejectOrder = (id) => api.patch(`/admin/orders/${id}/reject`).then(r => r.data);
export const manualReserve = (payload) =>
  api.post('/admin/numbers/reserve', payload).then(r => r.data);
