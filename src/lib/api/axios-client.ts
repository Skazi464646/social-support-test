// Mock axios client for form submission
// Note: In a real implementation, you would install and import axios

interface MockAxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  config: any;
  headers: any;
}

interface MockAxiosRequestConfig {
  url?: string;
  method?: string;
  data?: any;
  params?: any;
  timeout?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

class MockAxiosClient {
  async post<T = any>(url: string, data?: any, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock successful response
    return {
      data: { success: true, message: 'Mock response' } as T,
      status: 200,
      statusText: 'OK',
      config: { url, method: 'POST', data, ...config },
      headers: {},
    };
  }

  async get<T = any>(url: string, config?: MockAxiosRequestConfig): Promise<MockAxiosResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock successful response
    return {
      data: { success: true, message: 'Mock response' } as T,
      status: 200,
      statusText: 'OK',
      config: { url, method: 'GET', ...config },
      headers: {},
    };
  }
}

const axiosClient = new MockAxiosClient();

export default axiosClient;