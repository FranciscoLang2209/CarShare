"use client";

import React, { memo, useState } from 'react';
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { CalendarDays, Car as CarIcon, Users, Fuel, Settings, ArrowLeft, TrendingUp, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { CarSchema, CarFormData } from "@/schemas/car";
import { useCars } from "@/hooks/useCars";
import { useAuth } from "@/hooks/useAuth";
import { MultiSelect } from "@/components/ui/multi-select-simple";
import { Car } from "@/types";
import { getEfficiencyCategory, formatFuelEfficiency } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

// Delete Confirmation Dialog Component
const DeleteCarDialog = memo(({ 
	isOpen, 
	onClose, 
	onConfirm, 
	car, 
	isDeleting 
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	car: Car;
	isDeleting: boolean;
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						Eliminar Vehículo
					</DialogTitle>
					<DialogDescription>
						¿Estás seguro de que quieres eliminar el vehículo{" "}
						<strong>{car.brand} {car.model} {car.year}</strong>?
					</DialogDescription>
				</DialogHeader>
				
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<p className="text-sm text-red-800">
						<strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. Se eliminarán 
						todos los datos asociados con este vehículo, incluidas las sesiones y estadísticas.
					</p>
				</div>

				<DialogFooter className="flex gap-2">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isDeleting}
					>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
						className="flex items-center gap-2"
					>
						{isDeleting ? (
							<>
								<span className="animate-spin">⏳</span>
								Eliminando...
							</>
						) : (
							<>
								<Trash2 className="h-4 w-4" />
								Eliminar Vehículo
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
});

DeleteCarDialog.displayName = 'DeleteCarDialog';

// Car Card Component
const CarCard = memo(({ car, isAdmin, onDelete }: { 
	car: Car; 
	isAdmin: boolean; 
	onDelete?: (carId: string) => Promise<boolean>;
}) => {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	
	const handleViewSessions = () => {
		router.push(`/cars/${car.id}`);
	};

	const handleDeleteClick = () => {
		if (!onDelete || !isAdmin) return;
		setShowDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		if (!onDelete) return;
		
		setIsDeleting(true);
		try {
			await onDelete(car.id);
			setShowDeleteDialog(false);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCloseDialog = () => {
		if (!isDeleting) {
			setShowDeleteDialog(false);
		}
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
			<CardContent className="space-y-3">
				<div className="flex items-center gap-2">
					<Fuel className="h-4 w-4 text-muted-foreground" />
					<span className="text-sm">
						<strong>Eficiencia:</strong> {formatFuelEfficiency(car.fuelEfficiency)}
					</span>
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
					{isAdmin && onDelete && (
						<Button 
							variant="destructive" 
							size="sm"
							onClick={handleDeleteClick}
							disabled={isDeleting}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
				</div>
			</CardContent>
			
			{/* Delete Confirmation Dialog */}
			<DeleteCarDialog
				isOpen={showDeleteDialog}
				onClose={handleCloseDialog}
				onConfirm={handleConfirmDelete}
				car={car}
				isDeleting={isDeleting}
			/>
		</Card>
	);
});

CarCard.displayName = 'CarCard';

// Add Car Form Component
const AddCarForm = memo(() => {
	const { allUsers, createCar, deleteCar, isCreating, setIsDemoMode } = useCars();
	const { user } = useAuth();
	
	const form = useForm<CarFormData>({
		resolver: zodResolver(CarSchema),
		defaultValues: {
			model: "",
			brand: "",
			year: new Date().getFullYear(),
			fuelEfficiency: 11.5,
			users: [],
		},
	});

	const onSubmit = async (data: CarFormData) => {
		if (!user) {
			toast({
				title: "Error",
				description: "Debes estar autenticado para crear un vehículo",
				variant: "destructive",
			});
			return;
		}

		const success = await createCar({
			...data,
			admin: user
		});

		if (success) {
			form.reset();
			toast({
				title: "¡Éxito!",
				description: "Vehículo creado correctamente",
				variant: "default",
			});
		} else {
			toast({
				title: "Error",
				description: "No se pudo crear el vehículo",
				variant: "destructive",
			});
		}
	};

	const userOptions = allUsers.map(u => ({
		value: u.id,
		label: u.name
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Agregar Nuevo Vehículo</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="brand"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Marca</FormLabel>
										<FormControl>
											<Input placeholder="Toyota" {...field} />
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
											<Input placeholder="Corolla" {...field} />
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
												min="1900" 
												max={new Date().getFullYear() + 1}
												{...field}
												onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
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
												min="1" 
												max="50"
												step="0.1"
												{...field}
												onChange={(e) => field.onChange(parseFloat(e.target.value) || 11.5)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="users"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Usuarios con Acceso</FormLabel>
									<FormControl>
										<MultiSelect
											options={userOptions}
											selected={field.value}
											onChange={field.onChange}
											placeholder="Seleccionar usuarios..."
											className="w-full"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						
						<Button type="submit" disabled={isCreating} className="w-full">
							{isCreating ? "Creando..." : "Agregar Vehículo"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
});

AddCarForm.displayName = 'AddCarForm';

export default function HomePage() {
	const { 
		adminCars, 
		userCars, 
		isDemoMode, 
		isLoading, 
		error, 
		setIsDemoMode,
		deleteCar
	} = useCars();
	const { user } = useAuth();

	// Combine admin and user cars, but avoid duplicates
	const allCars = React.useMemo(() => {
		const carMap = new Map();
		
		// Add admin cars
		adminCars.forEach(car => {
			carMap.set(car.id, { ...car, isAdmin: true });
		});
		
		// Add user cars (might overwrite admin cars if user is also admin)
		userCars.forEach(car => {
			const existing = carMap.get(car.id);
			carMap.set(car.id, { 
				...car, 
				isAdmin: existing ? existing.isAdmin : false 
			});
		});
		
		return Array.from(carMap.values());
	}, [adminCars, userCars]);

	if (isLoading) {
		return (
			<main className="container mx-auto flex gap-5 pt-6 pb-10 flex-col px-4">
				<div className="flex items-center justify-between">
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

	return (
		<main className="container mx-auto flex gap-5 pt-6 pb-10 flex-col px-4">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Mis Vehículos</h1>
			</div>

			{error && (
				<Card>
					<CardContent className="py-8">
						<div className="text-center text-red-600">
							{error}
						</div>
					</CardContent>
				</Card>
			)}

			{/* My Cars Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<CarIcon className="h-5 w-5" />
					<h2 className="text-xl font-semibold">Vehículos Disponibles</h2>
					<Badge variant="outline">{allCars.length}</Badge>
				</div>
				
				{allCars.length === 0 ? (
					<Card>
						<CardContent className="py-8">
							<div className="text-center text-muted-foreground">
								<CarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p className="text-lg mb-2">No tienes vehículos disponibles</p>
								<p className="text-sm">Crea tu primer vehículo o solicita acceso a uno existente</p>
							</div>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{allCars.map((car) => (
							<CarCard 
								key={car.id} 
								car={car} 
								isAdmin={car.isAdmin || false}
								onDelete={deleteCar}
							/>
						))}
					</div>
				)}
			</div>

			{/* Add Car Form */}
			{user && <AddCarForm />}

			<Toaster />
		</main>
	);
}
