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
  
  // Debug log
  console.log('FuelTypeSlider render:', { value, selectedIndex });

  return (
    <div className="w-full space-y-3 border border-gray-200 p-4 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">
          Tipo de Combustible *
        </label>
        <span className="text-xs text-gray-500">
          Actual: {value}
        </span>
      </div>
      
      <div className="relative">
        {/* Slider track */}
        <div className="flex bg-white rounded-lg p-1 relative border border-gray-300 shadow-sm">
          {/* Sliding indicator */}
          {selectedIndex >= 0 && (
            <div 
              className="absolute top-1 bottom-1 bg-blue-600 rounded-md transition-all duration-300 ease-in-out shadow-md"
              style={{
                width: 'calc(33.333% - 2px)',
                transform: `translateX(${selectedIndex * 100}%)`,
                marginLeft: '1px'
              }}
            />
          )}
          
          {/* Options */}
          {fuelTypes.map((fuelType, index) => (
            <button
              key={fuelType.value}
              type="button"
              onClick={() => {
                console.log('Button clicked:', fuelType.value);
                onChange(fuelType.value);
              }}
              className={`
                flex-1 relative z-10 py-4 px-2 text-sm font-medium rounded-md transition-all duration-200
                ${value === fuelType.value 
                  ? 'text-white shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <div className="text-center">
                <div className="font-semibold text-sm leading-tight">{fuelType.label}</div>
                <div className="text-xs opacity-80 mt-1">{fuelType.price}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
            ⚠️ {error}
          </span>
        </div>
      )}
      
      {/* Info adicional */}
      <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
        💡 Precios de referencia en Pesos Argentinos (ARS) por litro
      </div>
    </div>
  );
};

export default FuelTypeSlider;
