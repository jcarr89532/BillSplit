export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  baseURL?: string;
  getToken?: () => Promise<string | null>;
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

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private getToken?: () => Promise<string | null>;

  constructor(config: RequestConfig = {}) {
    this.baseURL = config.baseURL || 'http://localhost:3001/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.timeout = config.timeout || 10000;
    this.getToken = config.getToken;
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'GET', ...config });
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
    return this.makeRequest<T>(url, { method: 'POST', body, ...config });
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const isFormData = options.body instanceof FormData;
      let headers = isFormData
        ? { ...options.headers }
        : { ...this.defaultHeaders, ...options.headers };

      // Automatically inject JWT token if getToken is provided
      if (this.getToken) {
        const token = await this.getToken();
        if (token) {
          headers = { ...headers, 'Authorization': `Bearer ${token}` };
        }
      }

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

      return { data, status: response.status, statusText: response.statusText };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) throw error;
      if (error instanceof Error) {
        if (error.name === 'AbortError') throw new ApiError('Request timeout', 408);
        throw new ApiError(error.message);
      }
      throw new ApiError('Unknown error occurred');
    }
  }
}
