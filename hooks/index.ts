// Export all hooks and utilities from the hooks directory

// API client and configuration
export { apiClient } from './api';
export type { ApiResponse, ApiError } from './api';

// Authentication hooks and types
export { useAuth, useLogin, useRegister, useLogout } from './useAuth';
export type { 
  LoginCredentials, 
  RegisterCredentials, 
  User, 
  AuthState 
} from './useAuth';

// Authentication Context Provider
export { AuthProvider, useAuthContext } from './AuthProvider';

// Generic API hooks
export { useApi, useFetch } from './useApi';

// Profile hooks
export { useProfile } from './useProfile';
export type { ProfileData, CreateProfileRequest, UpdateProfileRequest } from './useProfile';

// Re-export commonly used hooks for convenience
export { useAuth as default } from './useAuth';