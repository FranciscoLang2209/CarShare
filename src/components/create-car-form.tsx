import React, { useState } from 'react';
import { FuelTypeSlider } from '@/components/ui/fuel-type-slider';
import { carApi } from '@/services/api';
import { CreateCarData, Car } from '@/types';

interface CreateCarFormProps {
  adminId: string;
  onSuccess?: (car: Car) => void;
  onCancel?: () => void;
}

export const CreateCarForm: React.FC<CreateCarFormProps> = ({ adminId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateCarData>({
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    fuelEfficiency: 0,
    fuelType: 'Nafta Super', // Valor por defecto
    admin: adminId,
    users: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es obligatorio';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es obligatoria';
    }

    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Año inválido';
    }

    if (!formData.fuelEfficiency || formData.fuelEfficiency <= 0) {
      newErrors.fuelEfficiency = 'La eficiencia debe ser mayor a 0';
    }

    if (!formData.fuelType) {
      newErrors.fuelType = 'El tipo de combustible es obligatorio';
    }

    const validFuelTypes = ['Nafta Super', 'Nafta Premium', 'Diesel'];
    if (!validFuelTypes.includes(formData.fuelType)) {
      newErrors.fuelType = 'Tipo de combustible inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await carApi.createCar(formData);
      
      if (response.success) {
        onSuccess?.(response.data!);
      } else {
        setErrors({ submit: response.error || 'Error al crear el auto' });
      }
    } catch (error) {
      setErrors({ submit: 'Error inesperado al crear el auto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Crear Nuevo Auto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca *
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.brand ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Toyota, Ford, etc."
          />
          {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo *
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.model ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Corolla, Fiesta, etc."
          />
          {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año *
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.year ? 'border-red-500' : 'border-gray-300'
            }`}
            min="1900"
            max={new Date().getFullYear() + 1}
          />
          {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eficiencia de Combustible (km/L) *
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.fuelEfficiency || ''}
            onChange={(e) => setFormData({ ...formData, fuelEfficiency: parseFloat(e.target.value) || 0 })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fuelEfficiency ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="14.5"
          />
          {errors.fuelEfficiency && <p className="mt-1 text-sm text-red-600">{errors.fuelEfficiency}</p>}
        </div>

        {/* Slider para tipo de combustible */}
        <FuelTypeSlider
          value={formData.fuelType}
          onChange={(fuelType) => setFormData({ ...formData, fuelType: fuelType as any })}
          error={errors.fuelType}
        />

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Creando...' : 'Crear Auto'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateCarForm;
