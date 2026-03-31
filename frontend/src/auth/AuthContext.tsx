import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser } from '../api/types';
import { api } from '../api/client';

const STORAGE_KEY_USER  = 'aero_user';
const STORAGE_KEY_TOKEN = 'aero_token';

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Rehydrate user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        // Also make sure the token key is in sync
        if (parsed.token) {
          localStorage.setItem(STORAGE_KEY_TOKEN, parsed.token);
        }
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const authUser = await api.auth.login(email, password);
    if (!authUser) return false;

    setUser(authUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authUser));
    // The api client already persists the token, but we ensure it here too
    localStorage.setItem(STORAGE_KEY_TOKEN, authUser.token);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
