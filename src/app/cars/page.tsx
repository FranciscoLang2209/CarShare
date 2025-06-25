"use client";

import React, { memo } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { CalendarDays, Car as CarIcon, Users, Fuel, Settings, ArrowLeft, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { CarSchema, CarFormData } from "@/schemas/car";
import { useCars } from "@/hooks/useCars";
import { useAuth } from "@/hooks/useAuth";
import { MultiSelect } from "@/components/ui/multi-select-simple";
import { FuelTypeSlider } from "@/components/ui/fuel-type-slider";
import { Car } from "@/types";
import { getEfficiencyCategory, formatFuelEfficiency } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useBackendHealth } from "@/hooks/useBackendHealth";

// Configuration Status Component
const ConfigStatus = memo(({ demoMode, onDemoModeToggle }: { 
	demoMode: boolean; 
	onDemoModeToggle: (enabled: boolean) => void; 
}) => {
	const { isBackendConnected, isMqttConnected, isLoading } = useBackendHealth();

	const getStatusInfo = () => {
		if (demoMode) {
			return {
				color: 'bg-blue-500',
				text: 'Modo Demo',
				description: 'Usando datos simulados'
			};
		}
		
		if (isLoading) {
			return {
				color: 'bg-yellow-500',
				text: 'Verificando...',
				description: 'Comprobando estado del servidor'
			};
		}
		
		if (!isBackendConnected) {
			return {
				color: 'bg-red-500',
				text: 'Sin conexión',
				description: 'No se puede conectar al servidor'
			};
		}
		
		if (!isMqttConnected) {
			return {
				color: 'bg-orange-500',
				text: 'MQTT desconectado',
				description: 'El servidor no está conectado al broker MQTT'
			};
		}
		
		return {
			color: 'bg-green-500',
			text: 'Conectado',
			description: 'Servidor y MQTT funcionando correctamente'
		};
	};

	const statusInfo = getStatusInfo();

	return (
		<Card className="mb-4">
			<CardContent className="py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 text-sm">
						<div className="flex items-center gap-2">
							<div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
							<span>Estado:</span>
							<span className="font-medium">{statusInfo.text}</span>
						</div>
						<div className="text-muted-foreground">
							{statusInfo.description}
						</div>
						<div className="text-muted-foreground">
							API: {process.env.NEXT_PUBLIC_API_URL}
						</div>
					</div>
					<div className="flex items-center gap-2">
						<label className="text-sm text-muted-foreground">Modo Demo:</label>
						<input
							type="checkbox"
							checked={demoMode}
							onChange={(e) => onDemoModeToggle(e.target.checked)}
							className="rounded"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
});

ConfigStatus.displayName = 'ConfigStatus';

// Car Card Component
const CarCard = memo(({ car, isAdmin }: { car: Car; isAdmin: boolean }) => {
	const router = useRouter();
	
	const handleViewSessions = () => {
		router.push(`/cars/${car.id}`);
	};

	return (
		<Card className="w-full">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<CarIcon className="h-6 w-6 text-primary" />
						<div>
							<CardTitle className="text-lg">{car.brand} {car.model}</CardTitle>
							<CardDescription className="flex items-center gap-1">
								<CalendarDays className="h-4 w-4" />
								{car.year}
							</CardDescription>
						</div>
					</div>
					{isAdmin && (
						<Badge variant="default" className="text-xs">
							Administrador
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="flex items-center gap-2">
						<Fuel className="h-4 w-4 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">{formatFuelEfficiency(car.fuelEfficiency)}</p>
							<p className="text-xs text-muted-foreground">Eficiencia</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">{car.users.length}</p>
							<p className="text-xs text-muted-foreground">Usuarios</p>
						</div>
					</div>
				</div>
				
				{/* Tipo de combustible */}
				<div className="flex items-center gap-2">
					<Fuel className="h-4 w-4 text-muted-foreground" />
					<div>
						<p className="text-sm font-medium">{car.fuelType || 'Nafta Super'}</p>
						<p className="text-xs text-muted-foreground">Combustible</p>
					</div>
				</div>
				
				{/* Efficiency Category Badge */}
				<div className="flex items-center gap-2">
					<TrendingUp className="h-4 w-4 text-muted-foreground" />
					<Badge 
						variant={car.fuelEfficiency >= 15 ? "default" : car.fuelEfficiency >= 10 ? "secondary" : "destructive"}
						className="text-xs"
					>
						{getEfficiencyCategory(car.fuelEfficiency)}
					</Badge>
				</div>
				
				{!isAdmin && car.admin && (
					<div>
						<p className="text-sm font-medium text-muted-foreground mb-1">Administrador:</p>
						<Badge variant="outline">{car.admin.name}</Badge>
					</div>
				)}
				
				{car.users.length > 0 && (
					<div>
						<p className="text-sm font-medium text-muted-foreground mb-2">Usuarios compartidos:</p>
						<div className="flex flex-wrap gap-1">
							{car.users.map((user) => (
								<Badge key={user.id} variant="secondary" className="text-xs">
									{user.name}
								</Badge>
							))}
						</div>
					</div>
				)}
				
				<div className="flex gap-2 pt-2">
					<Button 
						variant="outline" 
						size="sm" 
						className="flex-1"
						onClick={handleViewSessions}
					>
						<Settings className="h-4 w-4 mr-2" />
						Ver Sesiones
					</Button>
				</div>
			</CardContent>
		</Card>
	);
});

CarCard.displayName = 'CarCard';

// Add Car Form Component
const AddCarForm = memo(() => {
	const { allUsers, createCar, isCreating, setIsDemoMode } = useCars();
	const { user } = useAuth();
	
	const form = useForm<CarFormData>({
		resolver: zodResolver(CarSchema),
		defaultValues: {
			model: "",
			brand: "",
			year: new Date().getFullYear(),
			fuelEfficiency: 11.5,
			fuelType: 'Nafta Super',
			users: [],
		},
	});

	const onSubmit = async (data: CarFormData) => {
		// Add client-side validation
		if (!data.brand || !data.model) {
			toast({
				title: "Error",
				description: "Marca y modelo son requeridos",
				variant: "destructive",
			});
			return;
		}

		const success = await createCar(data);
		
		if (success) {
			form.reset();
			toast({
				title: "¡Vehículo creado!",
				description: "El vehículo se ha agregado correctamente. Revisa la lista arriba.",
			});
		}
	};

	const userOptions = allUsers
		.filter(u => u.id !== user) // Exclude current user as they'll be admin
		.map(user => ({
			value: user.id,
			label: user.name,
		}));

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<CarIcon className="h-5 w-5" />
					Agregar Nuevo Vehículo
				</CardTitle>
				<CardDescription>
					Registra un nuevo vehículo en el sistema. Serás el administrador del vehículo.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form 
						onSubmit={form.handleSubmit(onSubmit)} 
						className="space-y-6"
						onKeyDown={(e) => {
							// Prevent form submission on Enter key in input fields
							if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
								e.preventDefault();
							}
						}}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="brand"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Marca</FormLabel>
										<FormControl>
											<Input 
												placeholder="Toyota, Honda, Ford..." 
												{...field} 
												disabled={isCreating}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="model"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Modelo</FormLabel>
										<FormControl>
											<Input 
												placeholder="Corolla, Civic, Focus..." 
												{...field} 
												disabled={isCreating}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Año</FormLabel>
										<FormControl>
											<Input 
												type="number"
												min={1900}
												max={new Date().getFullYear() + 1}
												{...field}
												onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
												disabled={isCreating}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="fuelEfficiency"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Eficiencia de Combustible (km/l)</FormLabel>
										<FormControl>
											<Input 
												type="number"
												min={1}
												max={50}
												step={0.1}
												placeholder="11.5"
												{...field}
												onChange={(e) => field.onChange(parseFloat(e.target.value) || 11.5)}
												disabled={isCreating}
											/>
										</FormControl>
										<p className="text-xs text-muted-foreground">
											Kilómetros por litro. Típico: 8-15 km/l, Eficiente: 15+ km/l
										</p>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Tipo de combustible */}
						<FormField
							control={form.control}
							name="fuelType"
							render={({ field }) => (
								<FormItem>
									<FuelTypeSlider
										value={field.value || 'Nafta Super'}
										onChange={(value) => {
											console.log('FuelType changed:', value);
											field.onChange(value);
										}}
										error={form.formState.errors.fuelType?.message}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="users"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Usuarios Compartidos (Opcional)</FormLabel>
									<FormControl>
										<MultiSelect
											options={userOptions}
											selected={field.value}
											onChange={field.onChange}
											placeholder="Seleccionar usuarios..."
											disabled={isCreating}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button 
							className="w-full" 
							type="submit" 
							disabled={isCreating}
						>
							{isCreating ? "Creando..." : "Crear Vehículo"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
});

AddCarForm.displayName = 'AddCarForm';

// Main My Cars Page Component
const MyCarsPage = memo(() => {
	const { adminCars, userCars, isLoading, error, setIsDemoMode } = useCars();
	const { user, name } = useAuth();
	const router = useRouter();
	const [demoMode, setDemoModeState] = React.useState(false);

	// Handle demo mode toggle
	const handleDemoModeToggle = (enabled: boolean) => {
		setDemoModeState(enabled);
		setIsDemoMode(enabled);
	};

	if (isLoading) {
		return (
			<main className="container mx-auto flex gap-5 pt-6 pb-10 flex-col px-4">
				<div className="flex items-center gap-4">
					<Button 
						variant="outline" 
						onClick={() => router.push('/')}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver al Dashboard
					</Button>
					<h1 className="text-3xl font-bold">Mis Vehículos</h1>
				</div>
				<div className="flex justify-center items-center py-12">
					<div className="text-center">
						<CarIcon className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
						<div className="text-muted-foreground">Cargando vehículos...</div>
					</div>
				</div>
				<Toaster />
			</main>
		);
	}

	if (error) {
		return (
			<main className="container mx-auto flex gap-5 pt-6 pb-10 flex-col px-4">
				<h1 className="text-3xl font-bold">Mis Vehículos</h1>
				<Card>
					<CardContent className="py-8">
						<div className="text-center text-red-600">
							Error al cargar los vehículos: {error}
						</div>
					</CardContent>
				</Card>
				<Toaster />
			</main>
		);
	}

	const hasAdminCars = adminCars.length > 0;
	const hasUserCars = userCars.length > 0;
	const hasAnyCars = hasAdminCars || hasUserCars;

	return (
		<main 
			className="container mx-auto flex gap-5 pt-6 pb-10 flex-col px-4"
			role="main"
			aria-label="Página de mis vehículos"
		>
			<div className="flex items-center gap-4">
				<Button 
					variant="outline" 
					onClick={() => router.push('/')}
					className="flex items-center gap-2"
				>
					<ArrowLeft className="h-4 w-4" />
					Volver al Dashboard
				</Button>
				<h1 className="text-3xl font-bold">Mis Vehículos</h1>
			</div>
			
			<ConfigStatus 
				demoMode={demoMode} 
				onDemoModeToggle={handleDemoModeToggle} 
			/>
			
			{/* Section A: List of My Cars */}
			<div className="space-y-6">
				{hasAdminCars && (
					<div>
						<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
							<Settings className="h-5 w-5" />
							Vehículos que Administro ({adminCars.length})
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{adminCars.map((car) => (
								<CarCard key={car.id} car={car} isAdmin={true} />
							))}
						</div>
					</div>
				)}

				{hasUserCars && (
					<div>
						<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
							<Users className="h-5 w-5" />
							Vehículos Compartidos Conmigo ({userCars.filter(car => car.admin.id !== user).length})
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{userCars
								.filter(car => car.admin.id !== user)
								.map((car) => (
									<CarCard key={car.id} car={car} isAdmin={false} />
								))}
						</div>
					</div>
				)}

				{!hasAnyCars && (
					<Card>
						<CardContent className="py-8">
							<div className="text-center text-muted-foreground">
								<CarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p className="text-lg mb-2">No tienes vehículos registrados</p>
								<p className="text-sm">Crea tu primer vehículo usando el formulario a continuación</p>
							</div>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Section B: Add New Car */}
			<div className="border-t pt-6">
				<AddCarForm />
			</div>

			<Toaster />
		</main>
	);
});

MyCarsPage.displayName = 'MyCarsPage';

export default MyCarsPage;
