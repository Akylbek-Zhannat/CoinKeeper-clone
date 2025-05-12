import api from './axios';

export const fetchCategories   = ()    => api.get('/categories');
export const postCategory      = cat   => api.post('/categories', cat);
export const deleteCategoryApi = id    => api.delete(`/categories/${id}`);
