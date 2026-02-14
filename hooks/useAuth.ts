
import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiResponse } from '../services/apiService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!apiService.getToken());

  const checkAuth = useCallback(() => {
    const token = apiService.getToken();
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    // Check on mount
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange); // Sync across tabs
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [checkAuth]);

  const login = async (username: string, password: string): Promise<ApiResponse> => {
    const res = await apiService.login(username, password);
    if (res.success) {
      checkAuth(); // Immediate local update
    }
    return res;
  };

  const register = async (data: any): Promise<ApiResponse> => {
    return await apiService.register(data);
  };

  const logout = () => {
    apiService.clearToken();
    checkAuth(); // Immediate local update
  };

  return { isAuthenticated, login, register, logout };
};
