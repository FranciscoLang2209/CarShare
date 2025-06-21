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
      console.log('🔍 Login response:', response);
      
      if (response.success && response.data) {
        const { user } = response.data;
        console.log('👤 Login user data received:', user);
        console.log('🆔 Login user ID:', user.id);
        console.log('📛 Login user name:', user.name);
        
        setUser(user.id);
        setName(user.name);
        cookieService.setAuthData(user.id, user.name);
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
      console.log('🔍 Registration response:', response);
      
      if (response.success && response.data) {
        const { user } = response.data;
        console.log('👤 User data received:', user);
        console.log('🆔 User ID:', user.id);
        console.log('📛 User name:', user.name);
        
        setUser(user.id);
        setName(user.name);
        cookieService.setAuthData(user.id, user.name);
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
