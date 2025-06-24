'use client';

import { useState, useEffect, useCallback } from 'react';
import { carApi } from '@/services/api';
import { Car, User, CreateCarData } from '@/types';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/use-toast';

// Demo data for development/testing
const DEMO_USERS: User[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com' },
  { id: '2', name: 'María García', email: 'maria@example.com' },
  { id: '3', name: 'Carlos López', email: 'carlos@example.com' },
];

const DEMO_CARS: Car[] = [
  {
    id: '1',
    model: 'Corolla',
    brand: 'Toyota',
    year: 2023,
    fuelEfficiency: 15.2,
    admin: DEMO_USERS[0],
    users: [DEMO_USERS[1], DEMO_USERS[2]],
  },
  {
    id: '2',
    model: 'Civic',
    brand: 'Honda',
    year: 2022,
    fuelEfficiency: 13.8,
    admin: DEMO_USERS[1],
    users: [DEMO_USERS[0]],
  },
];

export const useCars = () => {
  const { user } = useAuth();
  const [adminCars, setAdminCars] = useState<Car[]>([]);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchCars = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isDemoMode) {
        // Use demo data
        setAdminCars(DEMO_CARS.filter(car => car.admin.id === user));
        setUserCars(DEMO_CARS.filter(car => car.users.some(u => u.id === user)));
        setAllUsers(DEMO_USERS);
      } else {
        const [adminResponse, userResponse] = await Promise.all([
          carApi.getCarsByAdmin(user),
          carApi.getCarsByUser(user),
        ]);

        if (adminResponse.success) {
          setAdminCars(adminResponse.data || []);
        } else {
          setAdminCars([]);
        }

        if (userResponse.success) {
          setUserCars(userResponse.data || []);
        } else {
          setUserCars([]);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching cars';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, isDemoMode]);

  const fetchUsers = useCallback(async () => {
    try {
      if (isDemoMode) {
        setAllUsers(DEMO_USERS);
        return;
      }
      
      const response = await carApi.getAllUsers();
      if (response.success) {
        setAllUsers(response.data || []);
      }
    } catch (err) {
      // Silently fail for users fetch
    }
  }, [isDemoMode]);

  const createCar = useCallback(async (carData: CreateCarData) => {
    if (!user) return false;

    setIsCreating(true);
    try {
      if (isDemoMode) {
        // Simulate car creation in demo mode
        toast({
          title: "Demo Mode",
          description: "Vehículo creado en modo demo (no se guardará realmente)",
        });
        
        // Simulate adding the car to the local state
        const newCar: Car = {
          id: Date.now().toString(),
          model: carData.model,
          brand: carData.brand,
          year: carData.year,
          fuelEfficiency: carData.fuelEfficiency || 11.5,
          admin: DEMO_USERS.find(u => u.id === user) || DEMO_USERS[0],
          users: carData.users.map(userId => DEMO_USERS.find(u => u.id === userId)).filter(Boolean) as User[],
        };
        
        setAdminCars(prev => [...prev, newCar]);
        return true;
      }

      // Make sure we have the user data
      if (!user) {
        toast({
          title: "Error",
          description: "Usuario no encontrado. Por favor, inicia sesión nuevamente.",
          variant: "destructive",
        });
        return false;
      }

      const dataWithAdmin = {
        ...carData,
        admin: user, // Ensure admin field is set to current user ID
      };

      const response = await carApi.createCar(dataWithAdmin);
      
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Vehículo creado correctamente",
        });
        
        // Add a small delay before refreshing to ensure backend has processed
        setTimeout(async () => {
          await fetchCars();
        }, 500);
        
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Error al crear el vehículo",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating car';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [user, fetchCars, isDemoMode]);

  const deleteCar = useCallback(async (carId: string) => {
    if (!user) return false;

    try {
      if (isDemoMode) {
        // Simulate car deletion in demo mode
        toast({
          title: "Demo Mode",
          description: "Vehículo eliminado en modo demo",
        });
        
        setAdminCars(prev => prev.filter(car => car.id !== carId));
        setUserCars(prev => prev.filter(car => car.id !== carId));
        return true;
      }

      const response = await carApi.deleteCar(carId, user);
      
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Vehículo eliminado correctamente",
        });
        
        // Refresh cars after deletion
        await fetchCars();
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Error al eliminar el vehículo",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error eliminando el vehículo';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [user, fetchCars, isDemoMode]);

  useEffect(() => {
    if (user) {
      fetchCars();
      fetchUsers();
    }
  }, [user, fetchCars, fetchUsers]);

  // Combine admin and user cars, removing duplicates
  const allCars = [
    ...adminCars,
    ...userCars.filter(userCar => 
      !adminCars.some(adminCar => adminCar.id === userCar.id)
    )
  ];

  return {
    adminCars,
    userCars,
    allCars,
    allUsers,
    isLoading,
    isCreating,
    error,
    createCar,
    deleteCar, // Expose deleteCar function
    refreshCars: fetchCars,
    isDemoMode, // Add isDemoMode to the return object
    setIsDemoMode, // Expose setIsDemoMode to toggle demo mode
  };
};
