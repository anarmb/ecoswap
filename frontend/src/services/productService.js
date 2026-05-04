import { API } from './api.js';

const getAllProducts = async (filters = {}) => {
  const response = await API.get('/products', { params: filters });
  return response.data;
};

const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

const getMyProducts = async () => {
  const response = await API.get('/products/user/me');
  return response.data;
};

const createProduct = async (productData) => {
  const response = await API.post('/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updateProduct = async (id, productData) => {
  const response = await API.patch(`/products/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

export { getAllProducts, getProductById, getMyProducts, createProduct, updateProduct, deleteProduct };