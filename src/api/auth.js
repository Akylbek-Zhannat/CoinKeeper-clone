import api from './axios';

export const registerUser = creds => api.post('/auth/register', creds);
export const loginUser    = creds => api.post('/auth/login', creds);
