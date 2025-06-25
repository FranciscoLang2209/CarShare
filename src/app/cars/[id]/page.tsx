"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car as CarIcon, Fuel, Users, DollarSign, Route, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { carApi, sessionApi } from "@/services/api";
import { Car, Session, StatsData } from "@/types";
import { formatFuelEfficiency, getEfficiencyCategory, calculateTripCost } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import SessionControl from "@/components/session-control";
import { useActiveSession } from "@/hooks/useActiveSession";

export default function CarDetailPage() {
	const params = useParams();
	const router = useRouter();
	const carId = params.id as string;
	
	const { user, name } = useAuth();
	
	const { isBackendConnected, isMqttConnected } = useBackendHealth();
	const { activeSession, isLoading: activeSessionLoading } = useActiveSession(carId);

	const [car, setCar] = useState<Car | null>(null);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [stats, setStats] = useState<StatsData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!carId || !user) return;

		console.log('🚗 Iniciando carga de datos del vehículo:', carId);
		console.log('👤 Usuario:', user);

		const fetchCarData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				console.log('📞 Llamando a carApi.getCarById...');
				console.log('🔑 CarId que se va a usar:', carId, 'longitud:', carId.length);
				// Fetch car details
				const carResponse = await carApi.getCarById(carId);
				console.log('🚗 Respuesta del car:', carResponse);
				
				if (carResponse.success && carResponse.data) {
					setCar(carResponse.data);
					console.log('✅ Car cargado exitosamente:', carResponse.data);
					console.log('🆔 Car ID después de parsing:', carResponse.data.id, 'longitud:', carResponse.data.id?.length);
				} else {
					console.error('❌ Error cargando car:', carResponse.error);
					setError('No se pudo cargar la información del vehículo');
					return;
				}

				// Fetch sessions for this car
				try {
					// Try the car-specific endpoint first
					const carSessionsResponse = await sessionApi.getSessionsByCar(carId);
					if (carSessionsResponse.success && carSessionsResponse.data) {
						setSessions(carSessionsResponse.data);
					} else {
						// Fallback to general sessions and filter
						const sessionsResponse = await sessionApi.getSessions();
						if (sessionsResponse.success && sessionsResponse.data) {
							const carSessions = sessionsResponse.data.filter(session => 
								session.car?.id === carId
							);
							setSessions(carSessions);
						}
					}
				} catch (sessionError) {
					// If car-specific endpoint fails, try the general one
					const sessionsResponse = await sessionApi.getSessions();
					if (sessionsResponse.success && sessionsResponse.data) {
						const carSessions = sessionsResponse.data.filter(session => 
							session.car?.id === carId
						);
						setSessions(carSessions);
					}
				}

				// Fetch car-specific cost stats
				try {
					const carStatsResponse = await sessionApi.getCarCost(carId);
					if (carStatsResponse.success && carStatsResponse.data) {
						setStats(carStatsResponse.data);
					} else {
						// Fallback to user stats
						const statsResponse = await sessionApi.getUserCost(user);
						if (statsResponse.success && statsResponse.data) {
							setStats(statsResponse.data);
						}
					}
				} catch (statsError) {
					// Fallback to user stats
					const statsResponse = await sessionApi.getUserCost(user);
					if (statsResponse.success && statsResponse.data) {
						setStats(statsResponse.data);
					}
				}

			} catch (err) {
				console.error('❌ Error general al cargar datos:', err);
				setError('Error al cargar los datos del vehículo');
			} finally {
				console.log('🏁 Finalizando carga, setIsLoading(false)');
				setIsLoading(false);
			}
		};

		fetchCarData();
	}, [carId, user]);

	// Calculate car-specific stats
	const carStats = useMemo(() => {
		if (!sessions.length || !car) {
			return {
				totalCost: 0,
				totalDistance: 0,
				fuelConsumption: 0
			};
		}

		const totalDistance = sessions.reduce((sum, session) => sum + session.distance, 0);
		const fuelConsumption = totalDistance / car.fuelEfficiency;
		const totalCost = sessions.reduce((sum, session) => {
			return sum + calculateTripCost(session.distance, car.fuelEfficiency);
		}, 0);

		return {
			totalCost,
			totalDistance,
			fuelConsumption
		};
	}, [sessions, car]);

	console.log('🔍 Estado actual - isLoading:', isLoading, 'error:', error, 'car:', !!car);

	if (isLoading) {
		console.log('⏳ Mostrando pantalla de carga...');
		return (
			<main className="container mx-auto flex gap-5 pt-6 pb-10 flex-col px-4">
				<h1 className="text-3xl font-bold">Cargando...</h1>
				<div className="flex justify-center items-center py-12">
					<div className="text-center">
						<CarIcon className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
						<div className="text-muted-foreground">Cargando información del vehículo...</div>
					</div>
				</div>
				<Toaster />
			</main>
		);
	}

	if (error || !car) {
		console.log('❌ Mostrando pantalla de error...');
		return (
			<main className="container mx-auto flex gap-5 pt-6 pb-10 flex-col px-4">
				<h1 className="text-3xl font-bold">Error</h1>
				<Card>
					<CardContent className="py-8">
						<div className="text-center text-red-600">
							{error || 'Vehículo no encontrado'}
						</div>
					</CardContent>
				</Card>
				<Toaster />
			</main>
		);
	}

	const isAdmin = car.admin.id === user;

	return (
		<main className="container mx-auto flex gap-5 pt-6 pb-10 flex-col px-4">
			{/* Back button */}
			<div className="flex items-center gap-4">
				<Button 
					variant="outline" 
					onClick={() => router.push('/')}
					className="flex items-center gap-2"
				>
					<ArrowLeft className="h-4 w-4" />
					Volver a Mis Vehículos
				</Button>
				<h1 className="text-3xl font-bold">Detalles del Vehículo</h1>
			</div>

			{/* Main layout similar to home page */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Left column - Car info (similar to home page layout) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Car main card */}
					<Card className="p-6">
						<div className="flex items-start gap-6">
							{/* Car image */}
							<div className="flex-shrink-0">
								<div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
									{car.brand.toLowerCase() === 'toyota' && car.model.toLowerCase().includes('corolla') ? (
										<img 
											src="/corolla.png" 
											alt={`${car.brand} ${car.model} ${car.year}`}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<div className="text-center">
												<CarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
												<p className="text-xs text-gray-500">Imagen no disponible</p>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Car details */}
							<div className="flex-1 space-y-4">
								<div>
									<h1 className="text-2xl font-bold text-gray-900">
										{car.brand} {car.model} {car.year}
									</h1>
									{isAdmin && (
										<Badge variant="default" className="mt-2">
											Administrador
										</Badge>
									)}
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-600">Eficiencia (km/l)</p>
										<p className="text-lg font-semibold">{formatFuelEfficiency(car.fuelEfficiency)}</p>
									</div>
									<div>
										<p className="text-sm text-gray-600">Distancia (km)</p>
										<p className="text-lg font-semibold">{carStats.totalDistance.toFixed(0)}</p>
									</div>
								</div>
							</div>
						</div>

						{/* Administrator and users info */}
						<div className="mt-6 pt-6 border-t">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-gray-600 mb-2">Administrador</p>
									<Badge variant="outline">{car.admin.name}</Badge>
								</div>
								{car.users.length > 0 && (
									<div>
										<p className="text-sm font-medium text-gray-600 mb-2">
											Usuarios Compartidos ({car.users.length})
										</p>
										<div className="flex flex-wrap gap-1">
											{car.users.map((user) => (
												<Badge key={user.id} variant="secondary" className="text-xs">
													{user.name}
												</Badge>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</Card>
				</div>

				{/* Right column - Stats and info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Session Control Card */}
					<Card className="p-6">
						<div className="text-center space-y-4">
							<h3 className="text-lg font-semibold">Control de Viaje</h3>
							
							{/* Active Session Info */}
							{activeSession && (
								<div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
									<p className="text-sm font-medium text-blue-800 mb-1">
										🚗 Viaje en progreso
									</p>
									<p className="text-xs text-blue-600">
										Iniciado: {new Date(activeSession.start_time).toLocaleString('es-ES')}
									</p>
									<p className="text-xs text-blue-600">
										Distancia: {activeSession.distance.toFixed(2)} km
									</p>
								</div>
							)}
							
							{!activeSession && !activeSessionLoading && (
								<div className="mb-4 p-3 bg-gray-50 rounded-lg">
									<p className="text-sm text-gray-600">
										No hay viajes activos
									</p>
								</div>
							)}
							
							<div className="max-w-sm mx-auto">
								<SessionControl carId={carId} />
							</div>
						</div>
					</Card>
				</div>
			</div>

			{/* Stats Section */}
			<div className="mt-8">
				<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
					<DollarSign className="h-5 w-5" />
					Estadísticas del Vehículo
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<DollarSign className="h-8 w-8 text-green-600" />
								<div>
									<p className="text-2xl font-bold text-green-600">
										${carStats.totalCost.toFixed(2)}
									</p>
									<p className="text-sm text-muted-foreground">Costo Total</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<Route className="h-8 w-8 text-blue-600" />
								<div>
									<p className="text-2xl font-bold text-blue-600">
										{carStats.totalDistance.toFixed(1)} km
									</p>
									<p className="text-sm text-muted-foreground">Distancia Total</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<Fuel className="h-8 w-8 text-orange-600" />
								<div>
									<p className="text-2xl font-bold text-orange-600">
										{carStats.fuelConsumption.toFixed(1)} L
									</p>
									<p className="text-sm text-muted-foreground">Combustible Consumido</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Trips Section */}
			<div className="mt-8">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-3">
							<Clock className="h-5 w-5 text-primary" />
							Viajes
							<span className="text-sm text-muted-foreground">
								Últimos viajes de {car.brand} {car.model}
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{sessions.length > 0 ? (
							<div className="space-y-4">
								{sessions.map((session) => (
									<Card key={session.id} className="border-l-4 border-l-blue-500">
										<CardContent className="p-4">
											<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
												<div>
													<p className="text-sm text-muted-foreground">Usuario</p>
													<p className="font-medium">{session.user.name}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Distancia</p>
													<p className="font-medium">{session.distance.toFixed(1)} km</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Costo</p>
													<p className="font-medium text-green-600">
														${calculateTripCost(session.distance, car.fuelEfficiency).toFixed(2)}
													</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Fecha</p>
													<p className="font-medium">
														{new Date(session.start_time).toLocaleDateString()}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p className="text-lg mb-2">No hay viajes registrados</p>
								<p className="text-sm">Los viajes realizados con este vehículo aparecerán aquí</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<Toaster />
		</main>
	);
}
