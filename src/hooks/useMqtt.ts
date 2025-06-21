import { useEffect, useRef, useCallback } from 'react';
import { mqttService } from '@/services/mqtt';
import { APP_CONFIG, TOAST_MESSAGES } from '@/constants/app';
import { useToast } from '@/components/ui/use-toast';

interface UseMqttReturn {
  publishSessionStart: (userId: string) => void;
  publishSessionStop: (userId: string) => void;
  isConnected: boolean;
}

export const useMqtt = (): UseMqttReturn => {
  const { toast } = useToast();
  const clientRef = useRef(mqttService.connect(APP_CONFIG.MQTT.BROKER_URL));
  const isConnectedRef = useRef(false);

  useEffect(() => {
    const client = clientRef.current;

    const handleConnect = () => {
      isConnectedRef.current = true;
      console.log('Connected to MQTT broker');
    };

    const handleError = (error: Error) => {
      console.error('MQTT error:', error);
      isConnectedRef.current = false;
    };

    const handleClose = () => {
      isConnectedRef.current = false;
      console.log('MQTT connection closed');
    };

    client.on('connect', handleConnect);
    client.on('error', handleError);
    client.on('close', handleClose);

    // Cleanup function
    return () => {
      client.off('connect', handleConnect);
      client.off('error', handleError);
      client.off('close', handleClose);
    };
  }, []);

  const publishSessionStart = useCallback((userId: string) => {
    if (!userId) {
      toast(TOAST_MESSAGES.ERROR.NO_USER);
      return;
    }

    if (!isConnectedRef.current) {
      toast(TOAST_MESSAGES.ERROR.NETWORK);
      return;
    }

    mqttService.publish(APP_CONFIG.MQTT.TOPICS.SESSION_START, userId);
    toast(TOAST_MESSAGES.TRIP.STARTED);
  }, [toast]);

  const publishSessionStop = useCallback((userId: string) => {
    if (!userId) {
      toast(TOAST_MESSAGES.ERROR.NO_USER);
      return;
    }

    if (!isConnectedRef.current) {
      toast(TOAST_MESSAGES.ERROR.NETWORK);
      return;
    }

    mqttService.publish(APP_CONFIG.MQTT.TOPICS.SESSION_STOP, userId);
    toast(TOAST_MESSAGES.TRIP.ENDED);
  }, [toast]);

  return {
    publishSessionStart,
    publishSessionStop,
    isConnected: isConnectedRef.current,
  };
};
