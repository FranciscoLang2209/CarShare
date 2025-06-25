"use client";

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car as CarIcon, Fuel, Route } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserBalance } from "@/hooks/useUserBalance";
import { useCars } from "@/hooks/useCars";
import SessionControl from "./session-control";
import { formatCurrency, formatFuelEfficiency } from "@/lib/utils";

const CarInfoCard = memo(() => {
	const { allCars, isLoading } = useCars();
	const router = useRouter();
	
	// Get the first car for display, or show a prompt to add one
	const displayCar = allCars.length > 0 ? allCars[0] : null;
	
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Vehículo Principal</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center py-8">
					<CarIcon className="h-12 w-12 text-muted-foreground animate-pulse" />
					<span className="ml-3 text-muted-foreground">Cargando...</span>
				</CardContent>
			</Card>
		);
	}
	
	if (!displayCar) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Vehículo Principal</CardTitle>
				</CardHeader>
				<CardContent className="py-8">
					<div className="text-center">
						<CarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
						<p className="text-lg font-medium mb-2">No tienes vehículos</p>
						<p className="text-sm text-muted-foreground mb-4">
							Agrega tu primer vehículo para comenzar a usar CarShare
						</p>
						<Button onClick={() => router.push('/')}>
							Agregar Vehículo
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}
	
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{displayCar.brand} {displayCar.model}</span>
					<Button 
						variant="outline" 
						size="sm"
						onClick={() => router.push(`/cars/${displayCar.id}`)}
					>
						Ver Detalles
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex gap-6">
				{/* Car Image/Icon */}
				<div className="flex items-center justify-center bg-gray-100 rounded-lg p-6 min-w-[120px] min-h-[120px] overflow-hidden">
					{displayCar.brand.toLowerCase() === 'toyota' && displayCar.model.toLowerCase().includes('corolla') ? (
						<img 
							src="/corolla.png" 
							alt={`${displayCar.brand} ${displayCar.model} ${displayCar.year}`}
							className="w-full h-full object-cover rounded"
						/>
					) : (
						<div className="text-center">
							<CarIcon className="h-16 w-16 mx-auto mb-2 text-gray-600" />
							<p className="text-xs text-gray-500">{displayCar.year}</p>
						</div>
					)}
				</div>
				
				{/* Car Stats */}
				<div className="flex flex-col gap-4 flex-1">
					<div className="flex items-center gap-3">
						<Fuel className="h-5 w-5 text-muted-foreground" />
						<div>
							<p className="font-bold text-2xl" aria-label="Eficiencia de combustible">
								{formatFuelEfficiency(displayCar.fuelEfficiency)}
							</p>
							<p className="font-light text-sm">Eficiencia</p>
						</div>
					</div>
					
					{/* Tipo de combustible */}
					<div className="flex items-center gap-3">
						<Fuel className="h-5 w-5 text-muted-foreground" />
						<div>
							<p className="font-bold text-lg" aria-label="Tipo de combustible">
								{displayCar.fuelType || 'Nafta Super'}
							</p>
							<p className="font-light text-sm">Combustible</p>
						</div>
					</div>
					
					{allCars.length > 1 && (
						<div className="flex items-center gap-3">
							<CarIcon className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="font-bold text-2xl" aria-label="Total de vehículos">
									{allCars.length}
								</p>
								<p className="font-light text-sm">Vehículos</p>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
});

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
						onClick={() => router.push('/')}
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
