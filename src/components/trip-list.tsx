'use client';

import React, { memo } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useSessions } from '@/hooks/useSessions';
import { APP_CONFIG } from '@/constants/app';
import { formatDate, calculateTripCost } from '@/lib/utils';

const TripList = memo(() => {
	const { sessions, isLoading, error } = useSessions();

	if (isLoading) {
		return (
			<Card className="w-full">
				<CardHeader className="px-7">
					<CardTitle>Viajes</CardTitle>
					<CardDescription>Últimos viajes de {APP_CONFIG.CAR.MODEL}</CardDescription>
				</CardHeader>
				<CardContent>
					<div 
						className="flex justify-center items-center py-8"
						role="status"
						aria-label="Cargando viajes"
					>
						<div className="text-muted-foreground">Cargando viajes...</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className="w-full">
				<CardHeader className="px-7">
					<CardTitle>Viajes</CardTitle>
					<CardDescription>Últimos viajes de {APP_CONFIG.CAR.MODEL}</CardDescription>
				</CardHeader>
				<CardContent>
					<div 
						className="flex justify-center items-center py-8 text-red-600"
						role="alert"
						aria-label="Error al cargar viajes"
					>
						Error al cargar los viajes: {error}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!sessions.length) {
		return (
			<Card className="w-full">
				<CardHeader className="px-7">
					<CardTitle>Viajes</CardTitle>
					<CardDescription>Últimos viajes de {APP_CONFIG.CAR.MODEL}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center items-center py-8 text-muted-foreground">
						No hay viajes registrados
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full">
			<CardHeader className="px-7">
				<CardTitle>Viajes</CardTitle>
				<CardDescription>Últimos viajes de {APP_CONFIG.CAR.MODEL}</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Usuario</TableHead>
							<TableHead className="hidden sm:table-cell">Distancia</TableHead>
							<TableHead className="hidden md:table-cell">Fecha</TableHead>
							<TableHead className="text-right">Costo</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sessions.map((session, index) => {
							console.log('🚗 Session data:', session);
							console.log('🗓️ Start time:', session.start_time, 'type:', typeof session.start_time);
							console.log('🗓️ End time:', session.end_time, 'type:', typeof session.end_time);
							
							// Use car-specific fuel efficiency if available, otherwise use default
							const fuelEfficiency = session.car?.fuelEfficiency;
							const tripCost = calculateTripCost(session.distance, fuelEfficiency);
							
							return (
								<TableRow key={session.id || `session-${index}`}>
									<TableCell>
										<span className="font-medium">
											{session.user.name}
										</span>
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										{session.distance} km
									</TableCell>
									<TableCell className="hidden md:table-cell">
										<time dateTime={session.start_time}>
											{formatDate(session.start_time)}
										</time>
									</TableCell>
									<TableCell className="text-right font-semibold">
										$ {tripCost.toFixed(2)}
										{session.car && (
											<div className="text-xs text-muted-foreground">
												{session.car.brand} {session.car.model}
											</div>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
});

TripList.displayName = 'TripList';

export default TripList;