'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from './api';
import { useAuthContext } from './AuthProvider';

// Profile interfaces based on API schema
export interface ProfileData {
  name: string;
  birthday: string;
  height: number;
  weight: number;
  interests: string[];
}

export interface ProfileResponse {
  data: ProfileData;
}

export interface CreateProfileRequest extends ProfileData {}
export interface UpdateProfileRequest extends Partial<ProfileData> {}

// Custom hook for profile operations
export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuthContext();

  // Get profile
  const getProfile = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ProfileResponse>('/api/getProfile', token);
      
      if (response.data) {
        setProfile(response.data);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: 'No profile data received' };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to get profile';
      console.error('Get profile error:', error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated]);

  // Create profile
  const createProfile = useCallback(async (profileData: CreateProfileRequest) => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ message: string }>(
        '/api/createProfile', 
        profileData, 
        token
      );
      
      if (response.message) {
        // Refresh profile data after creation
        await getProfile();
        return { success: true, message: response.message };
      } else {
        return { success: false, error: 'Profile creation failed' };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create profile';
      console.error('Create profile error:', error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, getProfile]);

  // Update profile
  const updateProfile = useCallback(async (profileData: UpdateProfileRequest) => {
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.put<{ message: string }>(
        '/api/updateProfile', 
        profileData, 
        token
      );
      
      if (response.message) {
        // Refresh profile data after update
        await getProfile();
        return { success: true, message: response.message };
      } else {
        return { success: false, error: 'Profile update failed' };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      console.error('Update profile error:', error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, getProfile]);

  // Auto-fetch profile when hook is initialized
  useEffect(() => {
    if (isAuthenticated && token && !profile) {
      getProfile();
    }
  }, [isAuthenticated, token, profile, getProfile]);

  // Clear profile data when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setError(null);
    }
  }, [isAuthenticated]);

  return {
    profile,
    isLoading,
    error,
    getProfile,
    createProfile,
    updateProfile,
    hasProfile: !!profile,
    setError
  };
};