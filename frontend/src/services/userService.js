import { API } from './api.js';

const getAllUsers = async () => {
  const response = await API.get('/users');
  return response.data;
};

const getMyProfile = async () => {
  const response = await API.get('/users/me');
  return response.data;
};

const updateProfile = async (updateData) => {
  const response = await API.patch('/users/update', updateData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const deleteUser = async (id) => {
  if (!id) throw new Error("No se proporcionó un ID de usuario");
  const response = await API.delete(`/users/${id}`);
  return response.data;
};

const changePassword = async (passwords) => {
  const response = await API.patch('/users/change-password', passwords);
  return response.data;
};

export { getAllUsers, getMyProfile, updateProfile, deleteUser, changePassword };