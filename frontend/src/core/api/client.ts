import { API_CONFIG } from './config';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  baseURL?: string;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: RequestConfig = {}) {
    this.baseURL = config.baseURL || 'http://localhost:3001/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.timeout = config.timeout || 10000;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Don't set Content-Type for FormData - browser will set it with boundary
      const isFormData = options.body instanceof FormData;
      const headers = isFormData
        ? { ...options.headers }
        : {
            ...this.defaultHeaders,
            ...options.headers,
          };
      
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ApiError(
          data?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data
        );
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408);
        }
        throw new ApiError(error.message);
      }
      
      throw new ApiError('Unknown error occurred');
    }
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'GET',
      ...config,
    });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    // Don't stringify FormData - let browser handle it
    const body = data instanceof FormData 
      ? data 
      : data 
        ? JSON.stringify(data) 
        : undefined;
    
    return this.makeRequest<T>(url, {
      method: 'POST',
      body,
      ...config,
    });
  }

  // Set default headers
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  // Remove header
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  // Set base URL
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  // Get current base URL
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Default API client instance
export const apiClient = new ApiClient({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.DEFAULT_HEADERS,
  timeout: API_CONFIG.TIMEOUT
});

// AWS API Gateway client instance
export const awsClient = new ApiClient({
  baseURL: import.meta.env.VITE_AWS_API_BASE_URL || 'https://api.example.com',
  timeout: API_CONFIG.TIMEOUT
});

// Convenience exports
export const { get, post } = apiClient;
