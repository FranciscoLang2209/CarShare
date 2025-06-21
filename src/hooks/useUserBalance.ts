import { useState, useEffect, useCallback } from 'react';
import { StatsData } from '@/types';
import { sessionApi } from '@/services/api';

interface UseUserBalanceReturn {
  balance: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserBalance = (userId: string | null): UseUserBalanceReturn => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!userId) {
      setBalance(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await sessionApi.getUserCost(userId);
      
      if (response.success && response.data) {
        setBalance(response.data.totalCost || 0);
      } else {
        setError(response.error || 'Failed to fetch balance');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
  };
};
