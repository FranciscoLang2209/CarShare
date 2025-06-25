// Debug component to test health endpoint manually
// You can temporarily add this to any page to test the health check

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const HealthCheckDebug = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testHealthCheck = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing health check at:', process.env.NEXT_PUBLIC_API_URL + '/health');
      
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/health', {
        method: 'GET',
        cache: 'no-store',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      setResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Health check error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>🔧 Health Check Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testHealthCheck} disabled={loading}>
          {loading ? 'Probando...' : 'Probar Health Check'}
        </Button>
        
        {result && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
          <p>Endpoint: /health</p>
        </div>
      </CardContent>
    </Card>
  );
};
