// API configuration and base client
const API_BASE_URL = 'http://techtest.youapp.ai';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  status?: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    // Ensure body is properly stringified
    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    // Debug logging
    console.log('API Request:', {
      url,
      method: config.method,
      headers: config.headers,
      body: config.body,
      bodyType: typeof config.body
    });

    try {
      const response = await fetch(url, config);
      
      // Log response details
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('API Response Data:', data);

      if (!response.ok) {
        throw {
          success: false,
          message: Array.isArray(data.message) ? data.message.join(', ') : (data.message || `HTTP error! status: ${response.status}`),
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      if (error && typeof error === 'object' && 'success' in error) {
        throw error;
      }
      throw {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['x-access-token'] = token;
    }
    
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['x-access-token'] = token;
    }
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['x-access-token'] = token;
    }
    
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['x-access-token'] = token;
    }
    
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);