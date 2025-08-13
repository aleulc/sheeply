import axios from 'axios';

const api = axios.create({
  baseURL: 'http://sheeply.online/api',
});


// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Manejar errores específicos
      if (error.response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;