import { User, Session, ApiResponse, StatsData, Car, CreateCarData } from '@/types';

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
  console.log(`🌐 API Request: ${options.method || 'GET'} ${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log(`📡 API Response status: ${response.status}`);

    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const backendResponse = await response.json();
    console.log(`📝 Backend response:`, backendResponse);
    
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
    console.error(`❌ API Error - ${endpoint}:`, error);
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

export const carApi = {
  async getCarsByAdmin(adminId: string): Promise<ApiResponse<Car[]>> {
    console.log('🚗 Fetching cars by admin:', adminId);
    return apiRequest<Car[]>(`/car/admin/${adminId}`, {
      cache: 'no-store',
    });
  },

  async getCarsByUser(userId: string): Promise<ApiResponse<Car[]>> {
    console.log('👤 Fetching cars by user:', userId);
    return apiRequest<Car[]>(`/car/user/${userId}`, {
      cache: 'no-store',
    });
  },

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    console.log('👥 Fetching all users');
    return apiRequest<User[]>('/car/users', {
      cache: 'no-store',
    });
  },

  async createCar(carData: CreateCarData): Promise<ApiResponse<Car>> {
    console.log('🚗 Creating car:', carData);
    return apiRequest<Car>('/car', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },
};

export { ApiError };
