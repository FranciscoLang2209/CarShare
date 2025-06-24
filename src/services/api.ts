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

    // Try to parse the response body regardless of status
    let backendResponse;
    try {
      backendResponse = await response.json();
      console.log(`📝 Backend response:`, backendResponse);
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON:', parseError);
      backendResponse = { success: false, message: 'Invalid server response' };
    }

    if (!response.ok) {
      // Extract meaningful error message from backend response
      const errorMessage = getErrorMessage(response.status, backendResponse);
      console.error(`❌ HTTP ${response.status} Error:`, errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
    
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
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Extract user-friendly error messages based on HTTP status and backend response
 */
function getErrorMessage(status: number, backendResponse: any): string {
  // First, try to get the message from the backend response
  if (backendResponse?.message) {
    return backendResponse.message;
  }
  
  if (backendResponse?.error) {
    return backendResponse.error;
  }

  // Fallback to status-based messages
  switch (status) {
    case 400:
      return 'Datos inválidos. Por favor, verifica la información ingresada.';
    case 401:
      return 'Credenciales incorrectas. Verifica tu email y contraseña.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 409:
      return 'Este email ya está registrado.';
    case 422:
      return 'Los datos proporcionados no son válidos.';
    case 429:
      return 'Demasiados intentos. Intenta de nuevo más tarde.';
    case 500:
      return 'Error interno del servidor. Intenta de nuevo más tarde.';
    case 502:
    case 503:
    case 504:
      return 'El servidor no está disponible. Intenta de nuevo más tarde.';
    default:
      return `Error del servidor (${status}). Intenta de nuevo más tarde.`;
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
