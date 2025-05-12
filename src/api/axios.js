import axios from 'axios';
import { store } from '../app/store';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });
api.interceptors.request.use(cfg => {
  const token = store.getState().auth.token;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export default api;
