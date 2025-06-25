import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { sessionApi } from '@/services/api';
import { TOAST_MESSAGES } from '@/constants/app';
import { useSessionDebug } from './useSessionDebug';

interface UseMqttReturn {
  publishSessionStart: (userId: string, carId?: string) => Promise<void>;
  publishSessionStop: () => Promise<void>;
  isConnected: boolean;
}

export const useMqtt = (): UseMqttReturn => {
  const { toast } = useToast();
  const { debugSessionFlow } = useSessionDebug();

  const publishSessionStart = useCallback(async (userId: string, carId?: string) => {
    if (!userId) {
      toast(TOAST_MESSAGES.ERROR.NO_USER);
      return;
    }

    // Debug logs
    console.log('🚀 Iniciando viaje para userId:', userId);
    console.log('📏 Longitud del userId:', userId.length);
    console.log('🔍 Es ObjectId válido:', /^[0-9a-fA-F]{24}$/.test(userId));

    try {
      // Use HTTP endpoint instead of MQTT
      const response = await sessionApi.startSession(userId, carId);
      
      if (response.success) {
        toast(TOAST_MESSAGES.TRIP.STARTED);
        console.log('✅ Sesión iniciada exitosamente:', response.data);
        
        // Debug del flujo completo
        debugSessionFlow(userId);
      } else {
        console.error('❌ Error al iniciar sesión:', response.error);
        toast({
          title: "Error",
          description: response.error || "No se pudo iniciar la sesión",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      toast({
        title: "Error",
        description: "Error de conexión al iniciar sesión",
        variant: "destructive",
      });
    }
  }, [toast, debugSessionFlow]);

  const publishSessionStop = useCallback(async () => {
    try {
      const response = await sessionApi.stopSession();
      
      if (response.success) {
        toast(TOAST_MESSAGES.TRIP.ENDED);
        console.log('✅ Sesión terminada exitosamente');
      } else {
        console.error('❌ Error al terminar sesión:', response.error);
        toast({
          title: "Error", 
          description: response.error || "No se pudo terminar la sesión",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error al terminar sesión:', error);
      toast({
        title: "Error",
        description: "Error de conexión al terminar sesión", 
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    publishSessionStart,
    publishSessionStop,
    isConnected: true, // Always true since we're using HTTP endpoints
  };
};
