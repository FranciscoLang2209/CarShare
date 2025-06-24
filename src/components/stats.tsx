"use client";

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserBalance } from "@/hooks/useUserBalance";
import SessionControl from "./session-control";
import { APP_CONFIG } from "@/constants/app";
import { formatCurrency } from "@/lib/utils";

const CarInfoCard = memo(() => (
	<Card>
		<CardHeader>
			<CardTitle>{APP_CONFIG.CAR.MODEL}</CardTitle>
			<CardContent className="flex mb-0">
				<Image 
					src="/corolla.png" 
					width={300} 
					height={300} 
					alt={`Imagen del ${APP_CONFIG.CAR.MODEL}`}
					priority
				/>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<p className="font-bold text-2xl" aria-label="Eficiencia de combustible">
							{APP_CONFIG.CAR.FUEL_EFFICIENCY}
						</p>
						<p className="font-light">Eficiencia (km/l)</p>
					</div>
					<div className="flex flex-col gap-2">
						<p className="font-bold text-2xl" aria-label="Distancia total">
							{APP_CONFIG.CAR.TOTAL_DISTANCE}
						</p>
						<p className="font-light">Distancia (km)</p>
					</div>
				</div>
			</CardContent>
		</CardHeader>
	</Card>
));

CarInfoCard.displayName = 'CarInfoCard';

const BalanceCard = memo(({ balance, isLoading }: { balance: number; isLoading: boolean }) => (
	<Card>
		<CardHeader>
			<CardTitle>Balance</CardTitle>
		</CardHeader>
		<CardContent>
			{isLoading ? (
				<div 
					className="font-bold text-2xl text-muted-foreground"
					aria-label="Cargando balance"
				>
					Cargando...
				</div>
			) : (
				<p 
					className="font-bold text-red-700 text-2xl"
					aria-label={`Balance negativo de ${formatCurrency(balance)}`}
				>
					- {formatCurrency(balance)}
				</p>
			)}
		</CardContent>
	</Card>
));

BalanceCard.displayName = 'BalanceCard';

interface UserCardProps {
	name: string | null;
	onLogout: () => void;
}

const UserCard = memo(({ name, onLogout }: UserCardProps) => {
	const router = useRouter();
	
	return (
		<Card>
			<CardHeader>
				<CardTitle>Usuario</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<p className="font-bold" aria-label={`Usuario actual: ${name}`}>
					{name}
				</p>
				<div className="flex gap-2">
					<Button 
						variant="outline" 
						size="sm"
						onClick={() => router.push('/cars')}
						aria-label="Ver mis vehículos"
					>
						Mis Vehículos
					</Button>
					<Button 
						variant="destructive" 
						size="sm"
						onClick={onLogout}
						aria-label="Cerrar sesión"
					>
						Salir
					</Button>
				</div>
			</CardContent>
		</Card>
	);
});

UserCard.displayName = 'UserCard';

const Stats = memo(() => {
	const router = useRouter();
	const { user, name, logout } = useAuth();
	const { balance, isLoading } = useUserBalance(user);

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	return (
		<div className="flex flex-wrap gap-4 items-start">
			<CarInfoCard />
			<div className="flex gap-3">
				<BalanceCard balance={balance} isLoading={isLoading} />
				<UserCard name={name} onLogout={handleLogout} />
				<SessionControl />
			</div>
		</div>
	);
});

Stats.displayName = 'Stats';

export default Stats;
