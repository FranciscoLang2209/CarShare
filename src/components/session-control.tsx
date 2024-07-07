"use client";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import mqtt from "mqtt";
import {useAuth} from "@/hooks/useAuth";
import {useToast} from "@/components/ui/use-toast";

export default function SessionControl() {
	const client = mqtt.connect("ws://100.25.245.208:9001");
	const { user} = useAuth();
	const { toast } = useToast();

	client.on("connect", () => {
		console.log("Connected mqtt")
	})

	const handleStart = () => {
		if (!user) {
			toast({ title: "Error", description: "No user logged in", variant: "destructive" });
			return;
		}
		client.publish("carshare/inel00/session/start", user);
		toast({title: "Viaje iniciado", description: "El viaje ha sido iniciado"});
	}

	const handleStop = () => {
		if (!user) {
			toast({ title: "Error", description: "No user logged in", variant: "destructive" });
			return;
		}
		client.publish("carshare/inel00/session/stop", user);
		toast({title: "Viaje finalizado", description: "El viaje ha sido terminado", variant: "destructive"});
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
