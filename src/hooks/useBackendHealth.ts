import { useState, useEffect, useCallback, useRef } from 'react';

interface BackendHealthData {
  mqttConnected: boolean;
  timestamp: string;
}

interface UseBackendHealthReturn {
  isBackendConnected: boolean;
  isMqttConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastCheck: Date | null;
}

export const useBackendHealth = (intervalMs: number = 10000): UseBackendHealthReturn => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isMqttConnected, setIsMqttConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/health', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const healthData = await response.json();
      
      // Check if the response has the expected structure
      if (healthData.success && healthData.data) {
        setIsBackendConnected(true);
        setIsMqttConnected(healthData.data.mqttConnected || false);
        setError(null);
      } else {
        // Backend responded but without expected structure
        setIsBackendConnected(true);
        setIsMqttConnected(false);
        setError('Respuesta inesperada del servidor');
      }
      
      setLastCheck(new Date());
    } catch (err) {
      // Backend is not reachable
      setIsBackendConnected(false);
      setIsMqttConnected(false);
      setError(err instanceof Error ? err.message : 'Error de conexión');
      setLastCheck(new Date());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkHealth();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(checkHealth, intervalMs);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkHealth, intervalMs]);

  return {
    isBackendConnected,
    isMqttConnected,
    isLoading,
    error,
    lastCheck,
  };
};
