import { useEffect, useRef, useCallback } from 'react';
import { mqttService } from '@/services/mqtt';
import { APP_CONFIG, TOAST_MESSAGES } from '@/constants/app';
import { useToast } from '@/components/ui/use-toast';
import { useSessionDebug } from './useSessionDebug';

interface UseMqttReturn {
  publishSessionStart: (userId: string) => void;
  publishSessionStop: (userId: string) => void;
  isConnected: boolean;
}

export const useMqtt = (): UseMqttReturn => {
  const { toast } = useToast();
  const { debugSessionFlow } = useSessionDebug();

  const publishSessionStart = useCallback((userId: string) => {
    if (!userId) {
      toast(TOAST_MESSAGES.ERROR.NO_USER);
      return;
    }

    // Debug logs
    console.log('🚀 Iniciando viaje para userId:', userId);
    console.log('📏 Longitud del userId:', userId.length);
    console.log('🔍 Es ObjectId válido:', /^[0-9a-fA-F]{24}$/.test(userId));
    
    // Publish directly without checking frontend MQTT connection
    // SessionControl already validates backend connectivity
    mqttService.publish(APP_CONFIG.MQTT.TOPICS.SESSION_START, userId);
    toast(TOAST_MESSAGES.TRIP.STARTED);
    
    // Debug del flujo completo
    debugSessionFlow(userId);
  }, [toast, debugSessionFlow]);

  const publishSessionStop = useCallback((userId: string) => {
    if (!userId) {
      toast(TOAST_MESSAGES.ERROR.NO_USER);
      return;
    }

    // Publish directly without checking frontend MQTT connection  
    // SessionControl already validates backend connectivity
    mqttService.publish(APP_CONFIG.MQTT.TOPICS.SESSION_STOP, userId);
    toast(TOAST_MESSAGES.TRIP.ENDED);
  }, [toast]);

  return {
    publishSessionStart,
    publishSessionStop,
    isConnected: true, // Always true since validation is done by SessionControl
  };
};
