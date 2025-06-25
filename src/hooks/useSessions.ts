import { useState, useEffect, useCallback } from 'react';
import { Session } from '@/types';
import { sessionApi } from '@/services/api';

interface UseSessionsReturn {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSessions = (): UseSessionsReturn => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await sessionApi.getSessions();
      
      if (response.success && response.data) {
        // Sort sessions by startTime (most recent first)
        const sortedSessions = response.data.sort((a, b) => {
          const timeA = new Date(a.startTime || a.start_time || 0).getTime();
          const timeB = new Date(b.startTime || b.start_time || 0).getTime();
          return timeB - timeA;
        });
        setSessions(sortedSessions);
      } else {
        setError(response.error || 'Failed to fetch sessions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
