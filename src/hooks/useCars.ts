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
    if (!user) return;

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
          console.error('Error fetching admin cars:', adminResponse.error);
        }

        if (userResponse.success) {
          setUserCars(userResponse.data || []);
        } else {
          console.error('Error fetching user cars:', userResponse.error);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching cars';
      setError(errorMessage);
      console.error('Error fetching cars:', err);
      
      // If there's a network error, suggest demo mode
      if (err instanceof Error && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
        console.log('💡 Network error detected. Consider enabling demo mode to see sample data.');
      }
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
      } else {
        console.error('Error fetching users:', response.error);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
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

      const dataWithAdmin = {
        ...carData,
        admin: user,
      };

      const response = await carApi.createCar(dataWithAdmin);
      
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Vehículo creado correctamente",
        });
        await fetchCars(); // Refresh the cars list
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
    refreshCars: fetchCars,
    setIsDemoMode, // Expose setIsDemoMode to toggle demo mode
  };
};
