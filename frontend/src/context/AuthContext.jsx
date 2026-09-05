import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aiia_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('aiia_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('aiia_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('aiia_token', res.data.token);
      localStorage.setItem('aiia_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (registrationData) => {
    const res = await api.post('/auth/register', registrationData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('aiia_token', res.data.token);
      localStorage.setItem('aiia_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const quickDemoLogin = async (role) => {
    const res = await api.post('/auth/quick-demo', { role });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('aiia_token', res.data.token);
      localStorage.setItem('aiia_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aiia_token');
    localStorage.removeItem('aiia_user');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('aiia_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('aiia_user', JSON.stringify(updated));
      return updated;
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
        quickDemoLogin,
        logout,
        updateProfile,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'ADMIN',
        isResearcher: user?.role === 'RESEARCHER' || user?.role === 'ADMIN',
        isSafetyOfficer: user?.role === 'SAFETY_OFFICER' || user?.role === 'ADMIN',
        isComplianceOfficer: user?.role === 'COMPLIANCE_OFFICER' || user?.role === 'ADMIN',
        isManagement: user?.role === 'MANAGEMENT' || user?.role === 'ADMIN',
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
