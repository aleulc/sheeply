import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Registrar usuario
  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      const userResponse = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      setUser(userResponse.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el registro' 
      };
    }
  };

  // Iniciar sesión
  const login = async (formData) => {
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Credenciales inválidas' 
      };
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      register, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);