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
    // For browser environments, we'll simulate the publish
    // The actual MQTT publishing should be handled by the backend
    console.log(`📡 MQTT Publish (simulated): ${topic} -> ${message}`);
    
    // In a real implementation, this would either:
    // 1. Connect to a web-accessible MQTT broker, or
    // 2. Send HTTP request to backend which then publishes to MQTT
    
    // For now, we'll just log the action since the backend handles MQTT
    if (this.client && this.client.connected) {
      this.client.publish(topic, message);
    } else {
      console.warn('MQTT client is not connected - simulating publish');
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
