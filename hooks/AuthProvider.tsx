'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';
import type { AuthState, User } from './useAuth';

interface AuthContextType extends AuthState {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  // Debug logging for auth state
  React.useEffect(() => {
    console.log('AuthProvider - Auth state changed:', {
      isAuthenticated: auth.isAuthenticated,
      hasToken: !!auth.token,
      tokenLength: auth.token?.length,
      hasUser: !!auth.user,
      tokenPreview: auth.token ? `${auth.token.substring(0, 20)}...` : null
    });
  }, [auth.isAuthenticated, auth.token, auth.user]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Export for backward compatibility
export { useAuth } from './useAuth';