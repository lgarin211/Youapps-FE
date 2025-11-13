'use client';

import { useState, useCallback } from 'react';
import { apiClient, ApiResponse, ApiError } from './api';
import { useAuth } from './useAuth';

// Generic API hook for making HTTP requests
export const useApi = <T = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const execute = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    payload?: any
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let response: ApiResponse<T>;

      switch (method) {
        case 'GET':
          response = await apiClient.get<ApiResponse<T>>(endpoint, token || undefined);
          break;
        case 'POST':
          response = await apiClient.post<ApiResponse<T>>(endpoint, payload, token || undefined);
          break;
        case 'PUT':
          response = await apiClient.put<ApiResponse<T>>(endpoint, payload, token || undefined);
          break;
        case 'DELETE':
          response = await apiClient.delete<ApiResponse<T>>(endpoint, token || undefined);
          break;
      }

      if (response.success && response.data !== undefined) {
        setData(response.data);
        return { success: true, data: response.data };
      } else {
        const errorMessage = response.message || 'Request failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const get = useCallback((endpoint: string) => execute('GET', endpoint), [execute]);
  const post = useCallback((endpoint: string, payload?: any) => execute('POST', endpoint, payload), [execute]);
  const put = useCallback((endpoint: string, payload?: any) => execute('PUT', endpoint, payload), [execute]);
  const del = useCallback((endpoint: string) => execute('DELETE', endpoint), [execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    get,
    post,
    put,
    delete: del,
    reset,
  };
};

// Hook for fetching user profile
export const useProfile = () => {
  const api = useApi<any>();
  
  const fetchProfile = useCallback(() => {
    return api.get('/api/profile');
  }, [api]);

  const updateProfile = useCallback((profileData: any) => {
    return api.put('/api/profile', profileData);
  }, [api]);

  return {
    ...api,
    fetchProfile,
    updateProfile,
  };
};

// Hook for general data fetching with caching
export const useFetch = <T = any>(endpoint?: string) => {
  const [cache, setCache] = useState<Record<string, T>>({});
  const api = useApi<T>();

  const fetch = useCallback(async (url: string, useCache = true) => {
    if (useCache && cache[url]) {
      return { success: true, data: cache[url] };
    }

    const result = await api.get(url);
    
    if (result.success && result.data) {
      setCache(prev => ({ ...prev, [url]: result.data as T }));
    }

    return result;
  }, [api, cache]);

  const clearCache = useCallback((url?: string) => {
    if (url) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[url];
        return newCache;
      });
    } else {
      setCache({});
    }
  }, []);

  // Auto-fetch if endpoint is provided
  const { data, isLoading, error } = api;

  return {
    data,
    isLoading,
    error,
    fetch,
    clearCache,
    refetch: endpoint ? () => fetch(endpoint, false) : undefined,
  };
};