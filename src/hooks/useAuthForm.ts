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
        // Try different ways to access the user data
        let user = response.data;
        
        // Check if it's nested under 'user' key
        if ((response.data as any).user) {
          user = (response.data as any).user;
          console.log('📝 Found user in nested structure');
        }
        
        console.log('👤 Login user data received:', user);
        console.log('🆔 Login user ID:', (user as any)?.id);
        console.log('📛 Login user name:', (user as any)?.name);
        
        if (user && (user as any).id) {
          setUser((user as any).id);
          setName((user as any).name);
          cookieService.setAuthData((user as any).id, (user as any).name);
          router.push('/');
        } else {
          setError('Error al procesar los datos del usuario');
        }
      } else {
        // The API service now provides user-friendly error messages
        const errorMessage = response.error || 'Error al iniciar sesión';
        console.error('❌ Login failed:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('❌ Login exception:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado';
      setError(errorMessage);
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
      console.log('🔍 Registration response.data:', response.data);
      console.log('🔍 Type of response.data:', typeof response.data);
      console.log('🔍 Keys of response.data:', Object.keys(response.data || {}));
      
      if (response.success && response.data) {
        // Try different ways to access the user data
        let user = response.data;
        
        // Check if it's nested under 'user' key
        if ((response.data as any).user) {
          user = (response.data as any).user;
          console.log('📝 Found user in nested structure');
        }
        
        console.log('👤 User data received:', user);
        console.log('🆔 User ID:', (user as any)?.id);
        console.log('📛 User name:', (user as any)?.name);
        
        if (user && (user as any).id) {
          setUser((user as any).id);
          setName((user as any).name);
          cookieService.setAuthData((user as any).id, (user as any).name);
          router.push('/');
        } else {
          setError('Error al procesar los datos del usuario');
        }
      } else {
        // The API service now provides user-friendly error messages
        const errorMessage = response.error || 'Error al registrarse';
        console.error('❌ Registration failed:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('❌ Registration exception:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado';
      setError(errorMessage);
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
