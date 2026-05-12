import axios, { AxiosError } from 'axios';

export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    const message = Array.isArray(serverMessage) ? serverMessage[0] : serverMessage;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    if (status === 403) {
      return Promise.reject(new Error("You don't have permission to do this."));
    }

    if (status === 404) {
      return Promise.reject(new Error(message ?? 'The requested resource was not found.'));
    }

    if (status === 422 || status === 400) {
      return Promise.reject(new Error(message ?? 'Invalid request. Please check your input.'));
    }

    return Promise.reject(new Error(message ?? 'Something went wrong. Please try again.'));
  }
);
