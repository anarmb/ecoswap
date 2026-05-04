import { API } from './api.js';

const getAllTransactions = async (personal = false) => {
  const url = personal ? '/transactions?personal=true' : '/transactions';
  const response = await API.get(url);
  return response.data;
};

const getTransactionById = async (id) => {
  const response = await API.get(`/transactions/${id}`);
  return response.data;
};

const createTransaction = async (productId) => {
  const response = await API.post('/transactions', { product_id: productId });
  return response.data;
};

const updateTransactionStatus = async (id, status) => {
  const response = await API.patch(`/transactions/${id}`, { status });
  return response.data;
};

const deleteTransaction = async (id) => {
  const response = await API.delete(`/transactions/${id}`);
  return response.data;
};

export {getAllTransactions, getTransactionById, createTransaction, updateTransactionStatus,deleteTransaction};