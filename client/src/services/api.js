import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const fetchProducts = (query = '') => API.get(`/products${query}`);
export const fetchProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (formData) => API.post('/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteProduct = (id) => API.delete(`/products/${id}`);
