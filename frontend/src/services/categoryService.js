import { API } from './api.js';

const getAllCategories = async () => {
  const response = await API.get('/categories');
  return response.data;
};

const createCategory = async (categoryData) => {
  const response = await API.post('/categories', categoryData);
  return response.data;
};

const updateCategory = async (id, categoryData) => {
  const response = await API.patch(`/categories/${id}`, categoryData);
  return response.data;
};

const deleteCategory = async (id) => {
  const response = await API.delete(`/categories/${id}`);
  return response.data;
};

export { getAllCategories, createCategory, updateCategory, deleteCategory };