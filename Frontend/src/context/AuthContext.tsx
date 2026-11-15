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
  resendOtp: (email: string, purpose: 'signup' | 'login' | 'password_reset') => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (payload: { email: string; otp: string; new_password: string }) => Promise<{ status: string; message: string; email: string }>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEFAULT_ADMIN_USER: AuthUser = {
  id: 1,
  full_name: 'Shah Abdul Mazid',
  email: 'shahabdulmazid.ezan@yahoo.com',
  phone: '+880 1531329222',
  role: 'admin',
  is_verified: true,
  created_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
            localStorage.removeItem('careertrack_auth_token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch {
          // If network error, clear invalid session
          localStorage.removeItem('careertrack_auth_token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No saved token — display the initial Login / Sign Up portal
        setUser(null);
        setIsAuthenticated(false);
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

  const resendOtp = async (email: string, purpose: 'signup' | 'login' | 'password_reset'): Promise<AuthResponse> => {
    return await api.resendOtp({ email, purpose });
  };

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    return await api.forgotPassword(email);
  };

  const resetPassword = async (payload: { email: string; otp: string; new_password: string }): Promise<{ status: string; message: string; email: string }> => {
    return await api.resetPassword(payload);
  };

  const continueAsGuest = () => {
    setUser({
      id: 0,
      full_name: 'Guest Candidate',
      email: 'guest@careertrack.bd',
      phone: '+880 1500000000',
      role: 'candidate',
      is_verified: false,
      created_at: new Date().toISOString(),
    });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
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
        forgotPassword,
        resetPassword,
        logout,
        continueAsGuest,
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
