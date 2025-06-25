import React from 'react';
import { Car } from '@/types';

interface CarCardProps {
  car: Car;
  onSelect?: (car: Car) => void;
  showDetails?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onSelect, showDetails = true }) => {
  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'Nafta Super':
        return 'bg-green-100 text-green-800';
      case 'Nafta Premium':
        return 'bg-blue-100 text-blue-800';
      case 'Diesel':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelTypePrice = (fuelType: string) => {
    switch (fuelType) {
      case 'Nafta Super':
        return '$1,200 ARS/L';
      case 'Nafta Premium':
        return '$1,400 ARS/L';
      case 'Diesel':
        return '$1,250 ARS/L';
      default:
        return 'N/A';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border transition-shadow ${
        onSelect ? 'cursor-pointer hover:shadow-lg' : ''
      }`}
      onClick={() => onSelect?.(car)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {car.brand} {car.model}
          </h3>
          <p className="text-gray-600">Año {car.year}</p>
        </div>
        
        {/* Badge para tipo de combustible */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFuelTypeColor(car.fuelType || 'Nafta Super')}`}>
          {car.fuelType || 'Nafta Super'}
        </span>
      </div>

      {showDetails && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Eficiencia:</span>
            <span className="font-medium">{car.fuelEfficiency} km/L</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Combustible:</span>
            <span className="font-medium">{car.fuelType || 'Nafta Super'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Precio combustible:</span>
            <span className="font-medium text-sm">{getFuelTypePrice(car.fuelType || 'Nafta Super')}</span>
          </div>
          
          {car.users && (
            <div className="flex justify-between">
              <span className="text-gray-600">Usuarios:</span>
              <span className="font-medium">{Array.isArray(car.users) ? car.users.length : 0}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarCard;
