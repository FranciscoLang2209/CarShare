import React from 'react';

interface FuelTypeSliderProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const fuelTypes = [
  { value: 'Nafta Super', label: 'Nafta Super', price: '$1,200/L' },
  { value: 'Nafta Premium', label: 'Nafta Premium', price: '$1,400/L' },
  { value: 'Diesel', label: 'Diesel', price: '$1,250/L' }
];

export const FuelTypeSlider: React.FC<FuelTypeSliderProps> = ({ value, onChange, error }) => {
  const selectedIndex = fuelTypes.findIndex(ft => ft.value === value);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tipo de Combustible *
      </label>
      
      <div className="relative">
        {/* Slider track */}
        <div className="flex bg-gray-200 rounded-lg p-1 relative">
          {/* Sliding indicator */}
          <div 
            className="absolute top-1 bottom-1 bg-blue-600 rounded-md transition-transform duration-200 ease-in-out"
            style={{
              width: '33.333%',
              transform: `translateX(${selectedIndex * 100}%)`
            }}
          />
          
          {/* Options */}
          {fuelTypes.map((fuelType, index) => (
            <button
              key={fuelType.value}
              type="button"
              onClick={() => onChange(fuelType.value)}
              className={`
                flex-1 relative z-10 py-3 px-4 text-sm font-medium rounded-md transition-colors duration-200
                ${value === fuelType.value 
                  ? 'text-white' 
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}
            >
              <div className="text-center">
                <div className="font-semibold">{fuelType.label}</div>
                <div className="text-xs opacity-75">{fuelType.price}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {/* Info adicional */}
      <p className="mt-2 text-xs text-gray-500">
        Precios de referencia en Pesos Argentinos (ARS) por litro
      </p>
    </div>
  );
};

export default FuelTypeSlider;
