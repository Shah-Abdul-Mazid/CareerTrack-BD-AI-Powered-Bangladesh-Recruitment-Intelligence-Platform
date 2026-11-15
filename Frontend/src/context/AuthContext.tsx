import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { AuthUser, AuthResponse } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (payload: { full_name: string; email: string; password: string; phone?: string }) => Promise<AuthResponse>;
  verifyOtp: (email: string, otp: string, purpose: 'signup' | 'login') => Promise<AuthResponse>;
  resendOtp: (email: string, purpose: 'signup' | 'login') => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_USER: AuthUser = {
  id: 1,
  full_name: 'Shah Abdul Mazid',
  email: 'shahabdulmazid.ezan@yahoo.com',
  phone: '+880 1531329222',
  role: 'admin',
  is_verified: true,
  created_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_ADMIN_USER);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Load session from token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('careertrack_auth_token');
      if (savedToken) {
        setToken(savedToken);
        try {
          const res = await api.getMe();
          if (res.authenticated && res.user) {
            setUser(res.user);
            setIsAuthenticated(true);
          } else {
            // Keep default user profile
            setUser(DEFAULT_ADMIN_USER);
            setIsAuthenticated(true);
          }
        } catch {
          setUser(DEFAULT_ADMIN_USER);
          setIsAuthenticated(true);
        }
      } else {
        // Fallback default logged-in profile
        setUser(DEFAULT_ADMIN_USER);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.login({ email, password });
    return res;
  };

  const signup = async (payload: { full_name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> => {
    const res = await api.signup(payload);
    return res;
  };

  const verifyOtp = async (email: string, otp: string, purpose: 'signup' | 'login'): Promise<AuthResponse> => {
    const res = await api.verifyOtp({ email, otp, purpose });
    if (res.access_token) {
      localStorage.setItem('careertrack_auth_token', res.access_token);
      setToken(res.access_token);
      if (res.user) {
        setUser(res.user);
      }
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const resendOtp = async (email: string, purpose: 'signup' | 'login'): Promise<AuthResponse> => {
    return await api.resendOtp({ email, purpose });
  };

  const logout = async () => {
    await api.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('careertrack_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
