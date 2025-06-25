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
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Try to parse the response body regardless of status
    let backendResponse;
    try {
      backendResponse = await response.json();
    } catch (parseError) {
      backendResponse = { success: false, message: 'Invalid server response' };
    }

    if (!response.ok) {
      // Extract meaningful error message from backend response
      const errorMessage = getErrorMessage(response.status, backendResponse);
      
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

  async getActiveSessions(userId?: string): Promise<ApiResponse<Session | null>> {
    // The /user/sessions/active endpoint seems to have parameter issues
    // As a fallback, get all sessions and filter for active ones
    try {
      if (userId) {
        // Try the documented endpoint first
        const endpoint = `/user/sessions/active?userId=${encodeURIComponent(userId)}`;
        const response = await apiRequest<Session | null>(endpoint, { cache: 'no-store' });
        
        if (response.success) {
          return response;
        }
        
        // Fallback: get user sessions and find active one
        const userSessionsResponse = await apiRequest<Session[]>(`/user/sessions?id=${encodeURIComponent(userId)}`, { cache: 'no-store' });
        if (userSessionsResponse.success && userSessionsResponse.data) {
          const activeSessions = userSessionsResponse.data.filter(session => 
            session.isActive === true || (!session.endTime && !session.end_time && (session.startTime || session.start_time))
          );
          const activeSession = activeSessions.length > 0 ? activeSessions[0] : null;
          return { success: true, data: activeSession };
        }
      } else {
        // Get all sessions and find any active one
        const allSessionsResponse = await this.getSessions();
        if (allSessionsResponse.success && allSessionsResponse.data) {
          const activeSessions = allSessionsResponse.data.filter(session => 
            session.isActive === true || (!session.endTime && !session.end_time && (session.startTime || session.start_time))
          );
          const activeSession = activeSessions.length > 0 ? activeSessions[0] : null;
          return { success: true, data: activeSession };
        }
      }
      
      return { success: false, error: 'Could not retrieve active sessions' };
    } catch (error) {
      return { success: false, error: 'Error getting active sessions' };
    }
  },

  async getSessionsByCar(carId: string): Promise<ApiResponse<Session[]>> {
    if (!carId) {
      return { success: false, error: 'Car ID is required' };
    }
    
    try {
      // Try the specific endpoint first
      const directResponse = await apiRequest<Session[]>(`/user/sessions/car/${encodeURIComponent(carId)}`, {
        cache: 'no-store',
      });
      
      if (directResponse.success) {
        return directResponse;
      }
      
      // Fallback: get all sessions and filter by carId
      const allSessionsResponse = await this.getSessions();
      if (allSessionsResponse.success && allSessionsResponse.data) {
        const carSessions = allSessionsResponse.data.filter(session => {
          if (!session.car) return false;
          
          // Handle car field that comes as JSON string from backend
          let carData;
          if (typeof session.car === 'string') {
            try {
              // Parse the string representation of the MongoDB object
              const cleanStr = (session.car as string).replace(/new ObjectId\('([^']+)'\)/g, '"$1"')
                                          .replace(/(\w+):/g, '"$1":');
              carData = JSON.parse(cleanStr);
            } catch (e) {
              console.error('Error parsing car data:', e);
              return false;
            }
          } else {
            carData = session.car;
          }
          
          const sessionCarId = carData?._id || carData?.id;
          return sessionCarId === carId;
        });
        
        return { success: true, data: carSessions };
      }
      
      return { success: false, error: 'Failed to fetch sessions' };
    } catch (error) {
      return { success: false, error: 'Failed to fetch car sessions' };
    }
  },

  async startSession(userId: string, carId?: string): Promise<ApiResponse<Session>> {
    const body: any = { userId };
    if (carId) {
      body.carId = carId;
    }
    
    return apiRequest<Session>('/user/sessions/start', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async stopSession(): Promise<ApiResponse<null>> {
    return apiRequest<null>('/user/sessions/stop', {
      method: 'POST',
    });
  },

  async getUserCost(userId: string): Promise<ApiResponse<StatsData>> {
    const response = await apiRequest<StatsData>('/user/cost', {
      method: 'POST',
      body: JSON.stringify({ user: userId }),
    });
    
    // Asegurar que la moneda sea ARS
    if (response.success && response.data) {
      response.data.currency = 'ARS';
    }
    
    return response;
  },

  async getCarCost(carId: string): Promise<ApiResponse<StatsData>> {
    if (!carId) {
      return { success: false, error: 'Car ID is required' };
    }
    // Backend no tiene endpoint específico para costo de auto, retornar datos vacíos
    return { 
      success: true, 
      data: { 
        totalDistance: 0, 
        totalCost: 0, 
        fuelConsumption: 0,
        currency: 'ARS' // Cambiar a ARS
      } 
    };
  },
};

/**
 * Parse MongoDB string representations in car data
 */
function parseCarData(rawCar: any): Car {
  if (!rawCar) return rawCar;
  
  const car = { ...rawCar };
  
  // Parse admin field if it's a string
  if (typeof car.admin === 'string') {
    try {
      // More robust cleaning: handle both single and double quotes
      let cleanStr = car.admin
        // Replace ObjectId() wrappers
        .replace(/new ObjectId\('([^']+)'\)/g, '"$1"')
        .replace(/ObjectId\('([^']+)'\)/g, '"$1"')
        // Replace single quotes with double quotes, being careful with property names
        .replace(/(\w+):\s*'([^']*?)'/g, '"$1": "$2"')
        // Replace unquoted property names
        .replace(/(\w+):/g, '"$1":')
        // Handle remaining single quotes
        .replace(/'/g, '"');
      
      // Try to parse, if it fails, the data might already be an object
      const parsed = JSON.parse(cleanStr);
      car.admin = parsed;
    } catch (e) {
      console.warn('Could not parse admin data, keeping as string:', car.admin);
      // Keep as string if parsing fails
    }
  }
  
  // Parse users array if elements are strings
  if (Array.isArray(car.users)) {
    car.users = car.users.map((user: any) => {
      if (typeof user === 'string') {
        try {
          // More robust cleaning for user data
          let cleanStr = user
            // Replace ObjectId() wrappers
            .replace(/new ObjectId\('([^']+)'\)/g, '"$1"')
            .replace(/ObjectId\('([^']+)'\)/g, '"$1"')
            // Replace single quotes with double quotes, being careful with property names
            .replace(/(\w+):\s*'([^']*?)'/g, '"$1": "$2"')
            // Replace unquoted property names
            .replace(/(\w+):/g, '"$1":')
            // Handle remaining single quotes
            .replace(/'/g, '"');
          
          return JSON.parse(cleanStr);
        } catch (e) {
          console.warn('Could not parse user data, keeping as string:', user);
          return user;
        }
      }
      return user;
    });
  }
  
  return car;
}

export const carApi = {
  async getCarsByAdmin(adminId: string): Promise<ApiResponse<Car[]>> {
    if (!adminId) {
      return { success: false, error: 'Admin ID is required' };
    }
    
    const response = await apiRequest<Car[]>(`/car/admin/${encodeURIComponent(adminId)}`, {
      cache: 'no-store',
    });
    
    // Parse each car's data if successful
    if (response.success && response.data) {
      response.data = response.data.map(parseCarData);
    }
    
    return response;
  },

  async getCarsByUser(userId: string): Promise<ApiResponse<Car[]>> {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }
    
    const response = await apiRequest<Car[]>(`/car/user/${encodeURIComponent(userId)}`, {
      cache: 'no-store',
    });
    
    // Parse each car's data if successful
    if (response.success && response.data) {
      response.data = response.data.map(parseCarData);
    }
    
    return response;
  },

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiRequest<User[]>('/car/users', {
      cache: 'no-store',
    });
  },

  async createCar(carData: CreateCarData): Promise<ApiResponse<Car>> {
    // Validar que fuelType esté presente y sea válido
    if (!carData.fuelType) {
      return { success: false, error: 'El tipo de combustible es obligatorio' };
    }
    
    const validFuelTypes = ['Nafta Super', 'Nafta Premium', 'Diesel'];
    if (!validFuelTypes.includes(carData.fuelType)) {
      return { success: false, error: 'Tipo de combustible inválido' };
    }

    const response = await apiRequest<Car>('/car', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
    
    // Parse the car data if successful
    if (response.success && response.data) {
      response.data = parseCarData(response.data);
    }
    
    return response;
  },

  async getCarById(carId: string): Promise<ApiResponse<Car>> {
    if (!carId) {
      return { success: false, error: 'Car ID is required' };
    }
    
    const response = await apiRequest<Car>(`/car/${encodeURIComponent(carId)}`, {
      cache: 'no-store',
    });
    
    // Parse the car data if successful
    if (response.success && response.data) {
      response.data = parseCarData(response.data);
    }
    
    return response;
  },

  async deleteCar(carId: string, adminId: string): Promise<ApiResponse<void>> {
    if (!carId) {
      return { success: false, error: 'Car ID is required' };
    }
    if (!adminId) {
      return { success: false, error: 'Admin ID is required' };
    }
    return apiRequest<void>(`/car/${encodeURIComponent(carId)}/admin`, {
      method: 'DELETE',
      body: JSON.stringify({ adminId }),
    });
  },
};

export { ApiError };
