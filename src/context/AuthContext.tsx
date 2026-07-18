import React, { useState, useCallback, useEffect } from 'react';
import { User, RegisterData, LoginCredentials } from '../types';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextType } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';
  const isModerator = user?.role === 'MODERATOR' || user?.role === 'ADMIN';
  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await authApi.login(credentials);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      if (response.user.role === 'ADMIN' || response.user.role === 'MODERATOR') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const register = useCallback(
    async (data: RegisterData) => {
      await authApi.register(data);
      navigate('/login', { state: { message: 'Registration successful. Please log in.' } });
    },
    [navigate]
  );

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isModerator,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
