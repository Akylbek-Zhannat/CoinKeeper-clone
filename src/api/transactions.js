
import api from './axios';

export const fetchBalance = () => api.get('/transactions/balance');
export const fetchTransactions = () => api.get('/transactions');
export const postTransaction = (tx) => api.post('/transactions', tx);
export const updateTransactionApi = (id, tx) => api.put(`/transactions/${id}`, tx);
export const deleteTransactionApi = (id) => api.delete(`/transactions/${id}`);
