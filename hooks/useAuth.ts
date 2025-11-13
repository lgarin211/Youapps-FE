'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiClient, ApiResponse, ApiError } from './api';

// Types for authentication
export interface LoginCredentials {
  email: string;
  username: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Helper function to extract user data from JWT token
const extractUserFromToken = (token: string): User => {
  try {
    // JWT token has 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload);
    const parsedPayload = JSON.parse(decodedPayload);

    return {
      id: parsedPayload.id,
      email: parsedPayload.email,
      username: parsedPayload.username,
    };
  } catch (error) {
    console.error('Error extracting user from token:', error);
    // Return fallback user object
    return {
      id: '',
      email: '',
      username: '',
    };
  }
};

// Custom hook for authentication management
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true, // Start with loading true to prevent premature redirects
    error: null,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    // Delay to ensure localStorage is available (client-side only)
    const initializeAuth = () => {
      // Only run on client-side
      if (typeof window === 'undefined') {
        console.log('useAuth - Server-side, skipping localStorage initialization');
        setAuthState(prev => ({
          ...prev,
          isLoading: false, // Done loading on server-side
        }));
        return;
      }
      
      try {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        
        console.log('useAuth - Initializing from localStorage:', {
          hasStoredToken: !!storedToken,
          hasStoredUser: !!storedUser,
          tokenLength: storedToken?.length,
          storedUserData: storedUser ? JSON.parse(storedUser) : null
        });
        
        if (storedToken && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            console.log('useAuth - Setting auth from storage, token preview:', storedToken.substring(0, 20) + '...');
            setAuthState(prev => ({
              ...prev,
              token: storedToken,
              user,
              isAuthenticated: true,
              isLoading: false, // Done loading
            }));
          } catch (error) {
            // Clear invalid stored data
            console.error('useAuth - Error parsing stored data:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            setAuthState(prev => ({
              ...prev,
              isLoading: false, // Done loading
            }));
          }
        } else {
          console.log('useAuth - No valid stored auth data found');
          setAuthState(prev => ({
            ...prev,
            isLoading: false, // Done loading
          }));
        }
      } catch (error) {
        console.error('useAuth - localStorage not available:', error);
      }
    };

    // Use setTimeout to ensure this runs after client-side hydration
    const timer = setTimeout(initializeAuth, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const setAuth = useCallback((user: User, token: string) => {
    console.log('setAuth called with:', {
      user,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null
    });
    
    // Ensure we're on client-side before using localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('setAuth - Saved to localStorage, verifying:', {
        savedToken: localStorage.getItem('access_token')?.substring(0, 20) + '...',
        savedUser: localStorage.getItem('user')
      });
    }
    
    setAuthState(prev => ({
      ...prev,
      user,
      token,
      isAuthenticated: true,
      error: null,
    }));
  }, []);

  const clearAuth = useCallback(() => {
    // Ensure we're on client-side before using localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    
    setAuthState(prev => ({
      ...prev,
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setAuthState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setAuthState(prev => ({ ...prev, error }));
  }, []);

  return {
    ...authState,
    setAuth,
    clearAuth,
    setLoading,
    setError,
  };
};

// Custom hook for login functionality
export const useLogin = () => {
  const { setAuth, setLoading, setError, isLoading } = useAuth();

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure all fields are strings and not empty
      const cleanCredentials = {
        email: String(credentials.email || '').trim(),
        username: String(credentials.username || '').trim(),
        password: String(credentials.password || '').trim()
      };

      // Validate required fields
      if (!cleanCredentials.email || !cleanCredentials.username || !cleanCredentials.password) {
        setError('All fields are required');
        return { success: false, error: 'All fields are required' };
      }

      if (cleanCredentials.password.length < 8) {
        setError('Password must be at least 8 characters');
        return { success: false, error: 'Password must be at least 8 characters' };
      }

      // Debug logging
      console.log('Login credentials being sent:', cleanCredentials);

      const response = await apiClient.post<{
        message: string;
        access_token: string;
      }>('/api/login', cleanCredentials);

      console.log('Login response received:', response);

      if (response.access_token) {
        // Extract user info from JWT token
        const user = extractUserFromToken(response.access_token);
        setAuth(user, response.access_token);
        return { success: true, user, token: response.access_token };
      } else {
        const errorMessage = response.message || 'Login failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading, setError]);

  return {
    login,
    isLoading,
  };
};

// Custom hook for registration functionality
export const useRegister = () => {
  const { setAuth, setLoading, setError, isLoading } = useAuth();

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);

    try {
      // Ensure all fields are strings and not empty
      const cleanCredentials = {
        email: String(credentials.email || '').trim(),
        username: String(credentials.username || '').trim(),
        password: String(credentials.password || '').trim()
      };

      // Validate required fields
      if (!cleanCredentials.email || !cleanCredentials.username || !cleanCredentials.password) {
        setError('All fields are required');
        return { success: false, error: 'All fields are required' };
      }

      if (cleanCredentials.password.length < 8) {
        setError('Password must be at least 8 characters');
        return { success: false, error: 'Password must be at least 8 characters' };
      }

      // Debug logging
      console.log('Register credentials being sent:', cleanCredentials);

      const response = await apiClient.post<{
        message: string;
        access_token?: string;
      }>('/api/register', cleanCredentials);

      console.log('Register response received:', response);

      if (response.access_token) {
        // Auto login after successful registration
        const user = extractUserFromToken(response.access_token);
        setAuth(user, response.access_token);
        return { success: true, user, token: response.access_token, autoLogin: true };
      } else if (response.message) {
        // Registration successful but no auto login
        return { 
          success: true, 
          message: response.message || 'Registration successful',
          autoLogin: false 
        };
      } else {
        const errorMessage = response.message || 'Registration failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading, setError]);

  return {
    register,
    isLoading,
  };
};

// Custom hook for logout functionality
export const useLogout = () => {
  const { clearAuth, setLoading, token } = useAuth();

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      // Optional: Call logout endpoint if available
      if (token) {
        await apiClient.post('/api/logout', {}, token);
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      clearAuth();
      setLoading(false);
    }
  }, [clearAuth, setLoading, token]);

  return {
    logout,
  };
};