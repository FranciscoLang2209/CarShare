import { useState, useEffect, useCallback } from 'react';
import { sessionApi } from '@/services/api';
import { Session } from '@/types';

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

  const fetchActiveSession = useCallback(async () => {
    if (!carId) {
      setActiveSession(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await sessionApi.getSessionsByCar(carId);
      
      if (response.success && response.data) {
        // Look for active session (one without end_time)
        const activeSessions = response.data.filter(session => !session.end_time);
        
        if (activeSessions.length > 0) {
          // If there are multiple active sessions, take the most recent one
          const mostRecent = activeSessions.sort((a, b) => 
            new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
          )[0];
          setActiveSession(mostRecent);
        } else {
          setActiveSession(null);
        }
      } else {
        setActiveSession(null);
        setError(response.error || 'Failed to fetch sessions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setActiveSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    fetchActiveSession();
    
    // Set up interval to check for active sessions every 15 seconds
    const interval = setInterval(fetchActiveSession, 15000);
    
    return () => clearInterval(interval);
  }, [fetchActiveSession]);

  return {
    activeSession,
    isLoading,
    error,
    refetch: fetchActiveSession,
  };
};
