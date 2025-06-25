import { useState, useEffect, useCallback } from 'react';
import { sessionApi } from '@/services/api';
import { Session } from '@/types';
import { useAuth } from './useAuth';

interface UseActiveSessionReturn {
  activeSession: Session | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useActiveSession = (carId?: string): UseActiveSessionReturn => {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchActiveSession = useCallback(async () => {
    if (!user) {
      setActiveSession(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Buscando sesión activa para userId:', user);
      
      // Get active session for the current user
      const response = await sessionApi.getActiveSessions(user);
      
      if (response.success) {
        setActiveSession(response.data || null);
        console.log('✅ Sesión activa encontrada:', response.data);
      } else {
        setActiveSession(null);
        console.log('ℹ️ No hay sesiones activas');
        setError(response.error || 'Failed to fetch active session');
      }
    } catch (err) {
      console.error('❌ Error al buscar sesión activa:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setActiveSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchActiveSession();
    
    // Set up interval to check for active sessions every 10 seconds
    const interval = setInterval(fetchActiveSession, 10000);
    
    return () => clearInterval(interval);
  }, [fetchActiveSession]);

  return {
    activeSession,
    isLoading,
    error,
    refetch: fetchActiveSession,
  };
};
