// utils/authApi.ts
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

export const login = async (email: string, password: string) => {
  return await axios.post(`${API_BASE}/users/login/`, { email, password });
};

export const register = async (data: any) => {
  return await axios.post(`${API_BASE}/register/`, data);
};

export const refreshToken = async (refresh: string) => {
  return await axios.post(`${API_BASE}/token/refresh/`, { refresh });
};
