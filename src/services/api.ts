import { User, Session, ApiResponse, StatsData } from '@/types';

const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const backendResponse = await response.json();
    
    // Handle the backend's wrapped response format
    if (backendResponse.success) {
      return { success: true, data: backendResponse.data };
    } else {
      return {
        success: false,
        error: backendResponse.message || 'Backend error occurred',
      };
    }
  } catch (error) {
    console.error(`API Error - ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    return apiRequest<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name: string, email: string, password: string): Promise<ApiResponse<User>> {
    return apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
};

export const sessionApi = {
  async getSessions(): Promise<ApiResponse<Session[]>> {
    return apiRequest<Session[]>('/user/sessions', {
      cache: 'no-store',
    });
  },

  async getUserCost(userId: string): Promise<ApiResponse<StatsData>> {
    return apiRequest<StatsData>('/user/cost', {
      method: 'POST',
      body: JSON.stringify({ user: userId }),
    });
  },
};

export { ApiError };
