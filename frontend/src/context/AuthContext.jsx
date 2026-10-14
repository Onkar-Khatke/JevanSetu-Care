import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('jeevansetu_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('jeevansetu_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('jeevansetu_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res && res.data) {
            setUser(res.data);
            localStorage.setItem('jeevansetu_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or server unavailable', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res && res.data) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('jeevansetu_token', jwtToken);
      localStorage.setItem('jeevansetu_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Invalid login response');
  };

  const register = async (registerData) => {
    const res = await apiClient.post('/auth/register', registerData);
    if (res && res.data) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('jeevansetu_token', jwtToken);
      localStorage.setItem('jeevansetu_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jeevansetu_token');
    localStorage.removeItem('jeevansetu_user');
  };

  const getDashboardRoute = (role) => {
    if (!role) return '/login';
    const norm = role.replace('ROLE_', '');
    switch (norm) {
      case 'PATIENT':
        return '/patient/dashboard';
      case 'DOCTOR':
      case 'HEALTHCARE_WORKER':
        return '/doctor/dashboard';
      case 'AMBULANCE':
      case 'AMBULANCE_DRIVER':
        return '/ambulance/dashboard';
      case 'HOSPITAL':
        return '/hospital/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        getDashboardRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
