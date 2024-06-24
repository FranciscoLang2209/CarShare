"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Stats() {
	const router = useRouter();
	const { name } = useAuth();

	return (
		<div className="flex flex-wrap gap-4 items-start">
			<Card>
				<CardHeader>
					<CardTitle>
						Toyota Corolla 2012
					</CardTitle>
					<CardContent className="flex mb-0">
						<Image src="/corolla.png" width={300} height={300} alt="Auto corolla" />
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<p className="font-bold text-2xl">11.5</p>
								<p className="font-light">Consumo (km/l)</p>
							</div>
							<div className="flex flex-col gap-2">
								<p className="font-bold text-2xl">1000</p>
								<p className="font-light">Distancia (km)</p>
							</div>
						</div>
					</CardContent>
				</CardHeader>
			</Card>
			<div className="flex gap-3">
				<Card>
					<CardHeader>
						<CardTitle>
							Balance
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-bold text-red-700 text-2xl">
							- $5100
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Usuario</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center gap-3">
						<p className="font-bold">{name}</p>
						<Button variant="destructive" onClick={() => {
							Cookies.remove("user");
							router.push("/login")
						}}>
							Salir
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
