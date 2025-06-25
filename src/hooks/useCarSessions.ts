import { useState, useEffect, useCallback } from 'react';
import { sessionApi } from '@/services/api';
import { Session } from '@/types';

interface UseCarSessionsReturn {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCarSessions = (carId?: string): UseCarSessionsReturn => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!carId) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Buscando sesiones para carId:', carId);
      
      // Since sessions don't have car field, get all sessions
      // In the future, this should be fixed on the backend
      const response = await sessionApi.getSessions();
      
      if (response.success && response.data) {
        // For now, show all sessions since we can't filter by car
        // TODO: Filter by car when backend includes car field in sessions
        setSessions(response.data);
        console.log('✅ Sesiones encontradas:', response.data.length);
      } else {
        setSessions([]);
        setError(response.error || 'Failed to fetch sessions');
      }
    } catch (err) {
      console.error('❌ Error al buscar sesiones:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    isLoading,
    error,
    refetch: fetchSessions,
  };
};
