import mqtt, { MqttClient } from 'mqtt';

export class MqttService {
  private client: MqttClient | null = null;
  private static instance: MqttService;

  private constructor() {}

  static getInstance(): MqttService {
    if (!MqttService.instance) {
      MqttService.instance = new MqttService();
    }
    return MqttService.instance;
  }

  connect(brokerUrl: string = 'ws://100.25.245.208:9001'): MqttClient {
    if (!this.client) {
      this.client = mqtt.connect(brokerUrl);
      
      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
      });

      this.client.on('error', (error) => {
        console.error('MQTT connection error:', error);
      });

      this.client.on('close', () => {
        console.log('MQTT connection closed');
      });
    }
    
    return this.client;
  }

  publish(topic: string, message: string): void {
    if (this.client && this.client.connected) {
      this.client.publish(topic, message);
    } else {
      console.error('MQTT client is not connected');
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

export const mqttService = MqttService.getInstance();
