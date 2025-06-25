"use client";

import React, { memo } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useMqtt } from "@/hooks/useMqtt";
import { useBackendHealth } from "@/hooks/useBackendHealth";

const SessionControl = memo(() => {
	const { user } = useAuth();
	const { publishSessionStart, publishSessionStop } = useMqtt();
	const { isMqttConnected, isBackendConnected } = useBackendHealth();

	const handleStart = () => {
		if (user) {
			publishSessionStart(user);
		}
	};

	const handleStop = () => {
		if (user) {
			publishSessionStop(user);
		}
	};

	// Both backend and MQTT need to be connected for trips to work
	const canStartTrip = user && isBackendConnected && isMqttConnected;
	
	const getConnectionStatus = () => {
		if (!isBackendConnected) {
			return "Sin conexión al servidor";
		}
		if (!isMqttConnected) {
			return "Sin conexión MQTT";
		}
		return null;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Viaje nuevo</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<Button 
					onClick={handleStart}
					disabled={!canStartTrip}
					className="w-full"
					aria-label="Iniciar nuevo viaje"
				>
					Iniciar
				</Button>
				<Button 
					onClick={handleStop}
					disabled={!canStartTrip}
					variant="outline"
					className="w-full"
					aria-label="Terminar viaje actual"
				>
					Terminar
				</Button>
				{getConnectionStatus() && (
					<p 
						className="text-sm text-muted-foreground text-center"
						role="status"
						aria-label="Estado de conexión"
					>
						{getConnectionStatus()}
					</p>
				)}
			</CardContent>
		</Card>
	);
});

SessionControl.displayName = 'SessionControl';

export default SessionControl;
