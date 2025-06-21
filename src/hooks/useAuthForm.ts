import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/services/api';
import { cookieService } from '@/services/cookies';
import { LoginFormData, RegisterFormData } from '@/schemas/auth';

interface UseAuthFormReturn {
  isLoading: boolean;
  error: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setName } = useAuth();
  const router = useRouter();

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(data.email, data.password);
      
      if (response.success && response.data) {
        const { user } = response.data;
        setUser(user._id);
        setName(user.name);
        cookieService.setAuthData(user._id, user.name);
        router.push('/');
      } else {
        setError(response.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(data.name, data.email, data.password);
      
      if (response.success && response.data) {
        const { user } = response.data;
        setUser(user._id);
        setName(user.name);
        cookieService.setAuthData(user._id, user.name);
        router.push('/');
      } else {
        setError(response.error || 'Error al registrarse');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    login,
    register,
  };
};
