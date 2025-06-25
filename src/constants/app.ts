export const APP_CONFIG = {
  CAR: {
    MODEL: 'Toyota Corolla 2012',
    FUEL_EFFICIENCY: 11.5, // km/l (renamed from FUEL_CONSUMPTION for clarity)
    FUEL_CONSUMPTION: 11.5, // km/l (kept for backward compatibility)
    TOTAL_DISTANCE: 1000, // km
    COST_PER_KM_FACTOR: 1013 / 11.5, // Cálculo del costo por km
  },
  FUEL: {
    TYPES: {
      NAFTA_SUPER: 'Nafta Super',
      NAFTA_PREMIUM: 'Nafta Premium',
      DIESEL: 'Diesel',
    },
    PRICES_ARS: {
      'Nafta Super': 1200,
      'Nafta Premium': 1400,
      'Diesel': 1250,
    },
    DEFAULT_TYPE: 'Nafta Super',
  },
  CURRENCY: {
    CODE: 'ARS',
    SYMBOL: '$',
    NAME: 'Peso Argentino',
  },
  MQTT: {
    BROKER_URL: 'ws://100.25.245.208:9001',
    TOPICS: {
      SESSION_START: 'carshare/inel00/session/start',
      SESSION_STOP: 'carshare/inel00/session/stop',
    },
  },
  API: {
    BASE_URL: process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001',
  },
} as const;

export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: 'El email es requerido',
    INVALID: 'El formato del email no es válido',
  },
  PASSWORD: {
    MIN_LENGTH: 4,
    REQUIRED: 'La contraseña es requerida',
    TOO_SHORT: 'La contraseña debe tener al menos 4 caracteres',
  },
  NAME: {
    MIN_LENGTH: 4,
    REQUIRED: 'El nombre es requerido',
    TOO_SHORT: 'El nombre debe tener al menos 4 caracteres',
  },
} as const;

export const TOAST_MESSAGES = {
  TRIP: {
    STARTED: {
      title: 'Viaje iniciado',
      description: 'El viaje ha sido iniciado correctamente',
    },
    ENDED: {
      title: 'Viaje finalizado',
      description: 'El viaje ha sido terminado',
      variant: 'destructive' as const,
    },
  },
  ERROR: {
    NO_USER: {
      title: 'Error',
      description: 'No hay usuario autenticado',
      variant: 'destructive' as const,
    },
    NETWORK: {
      title: 'Error de conexión',
      description: 'No se pudo conectar con el servidor',
      variant: 'destructive' as const,
    },
    AUTH: {
      INVALID_CREDENTIALS: {
        title: 'Credenciales incorrectas',
        description: 'Verifica tu email y contraseña',
        variant: 'destructive' as const,
      },
      USER_EXISTS: {
        title: 'Usuario ya existe',
        description: 'Este email ya está registrado',
        variant: 'destructive' as const,
      },
      INVALID_DATA: {
        title: 'Datos inválidos',
        description: 'Por favor, verifica la información ingresada',
        variant: 'destructive' as const,
      },
      SESSION_EXPIRED: {
        title: 'Sesión expirada',
        description: 'Por favor, inicia sesión nuevamente',
        variant: 'destructive' as const,
      },
    },
    GENERIC: {
      title: 'Error',
      description: 'Ha ocurrido un error inesperado',
      variant: 'destructive' as const,
    },
  },
} as const;
