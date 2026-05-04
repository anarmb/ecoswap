import {API} from './api.js';

const loginUser = async (credentials) => {
  const response = await API.post('/users/login', credentials);
  return response.data; 
};

const registerUser = async (userData) => {
  const response = await API.post('/users/register', userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user'); 
};

export {loginUser, registerUser, logoutUser};