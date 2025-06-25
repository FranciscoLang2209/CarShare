import { useCallback } from 'react';
import { sessionApi } from '@/services/api';

export const useSessionDebug = () => {
  const checkActiveSession = useCallback(async (userId: string) => {
    console.log('🔍 Verificando sesión activa para userId:', userId);
    
    try {
      // Esperar un poco para que el backend procese el mensaje MQTT
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await sessionApi.getActiveSessions(userId);
      
      console.log('📋 Respuesta de sesiones activas:', response);
      
      if (response.success) {
        if (response.data) {
          console.log('✅ Sesión activa encontrada:', response.data);
          console.log('📅 Hora de inicio:', response.data.start_time);
          console.log('� Hora de fin:', response.data.end_time || 'No terminada');
          console.log('�🚗 Carro:', response.data.car);
          console.log('👤 Usuario:', response.data.user);
          console.log('� Distancia:', response.data.distance);
        } else {
          console.log('❌ No hay sesión activa');
        }
      } else {
        console.log('❌ Error al consultar sesiones activas:', response.error);
      }
    } catch (error) {
      console.error('❌ Error en verificación de sesión:', error);
    }
  }, []);

  const debugSessionFlow = useCallback(async (userId: string) => {
    console.log('🚀🚀🚀 INICIANDO DEBUG DE SESIÓN 🚀🚀🚀');
    console.log('👤 UserId:', userId);
    console.log('📏 Longitud:', userId.length);
    console.log('🔍 Formato válido:', /^[0-9a-fA-F]{24}$/.test(userId));
    
    // Verificar inmediatamente
    await checkActiveSession(userId);
    
    // Verificar de nuevo después de 5 segundos
    setTimeout(() => {
      console.log('🔄 Segunda verificación...');
      checkActiveSession(userId);
    }, 5000);
  }, [checkActiveSession]);

  return {
    debugSessionFlow,
    checkActiveSession,
  };
};
