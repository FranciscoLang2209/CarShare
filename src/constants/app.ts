export const APP_CONFIG = {
  CAR: {
    MODEL: 'Toyota Corolla 2012',
    FUEL_CONSUMPTION: 11.5, // km/l
    TOTAL_DISTANCE: 1000, // km
    COST_PER_KM_FACTOR: 1013 / 11.5, // Cálculo del costo por km
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
  },
} as const;
