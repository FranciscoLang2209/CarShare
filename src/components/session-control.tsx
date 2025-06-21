"use client";

import React, { memo } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useMqtt } from "@/hooks/useMqtt";

const SessionControl = memo(() => {
	const { user } = useAuth();
	const { publishSessionStart, publishSessionStop, isConnected } = useMqtt();

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

	return (
		<Card>
			<CardHeader>
				<CardTitle>Viaje nuevo</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<Button 
					onClick={handleStart}
					disabled={!user || !isConnected}
					className="w-full"
					aria-label="Iniciar nuevo viaje"
				>
					Iniciar
				</Button>
				<Button 
					onClick={handleStop}
					disabled={!user || !isConnected}
					variant="outline"
					className="w-full"
					aria-label="Terminar viaje actual"
				>
					Terminar
				</Button>
				{!isConnected && (
					<p 
						className="text-sm text-muted-foreground text-center"
						role="status"
						aria-label="Estado de conexión"
					>
						Sin conexión
					</p>
				)}
			</CardContent>
		</Card>
	);
});

SessionControl.displayName = 'SessionControl';

export default SessionControl;
