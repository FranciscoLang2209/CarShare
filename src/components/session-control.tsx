"use client";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import mqtt from "mqtt";

export default function SessionControl() {
	const client = mqtt.connect("ws://localhost:9001");

	client.on("connect", () => {
		console.log("Connected mqtt")
	})

	const handleStart = () => {
		client.publish("carshare/inel00/session/start", "1");
	}

	const handleStop = () => {
		client.publish("carshare/inel00/session/stop", "1");
	}


	return (
		<Card>
			<CardHeader>
				<CardTitle>Viaje nuevo</CardTitle>
			</CardHeader>
			<CardContent>
				<Button onClick={handleStart}>Iniciar</Button>
			</CardContent>
			<CardContent>
				<Button onClick={handleStop}>Terminar</Button>
			</CardContent>
		</Card>
	)
}
