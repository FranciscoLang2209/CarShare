import React from 'react';

interface FuelTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const fuelOptions = [
  { value: 'Nafta Super', label: 'Nafta Super', price: '$1,200/L', color: 'green' },
  { value: 'Nafta Premium', label: 'Nafta Premium', price: '$1,400/L', color: 'blue' },
  { value: 'Diesel', label: 'Diesel', price: '$1,250/L', color: 'orange' }
];

export const FuelTypeSelector: React.FC<FuelTypeSelectorProps> = ({ value, onChange, error }) => {
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {fuelOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative p-4 border-2 rounded-lg transition-all duration-200 text-left
              ${value === option.value 
                ? `border-${option.color}-500 bg-${option.color}-50 shadow-md` 
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-semibold text-sm ${
                  value === option.value ? `text-${option.color}-800` : 'text-gray-700'
                }`}>
                  {option.label}
                </div>
                <div className={`text-xs ${
                  value === option.value ? `text-${option.color}-600` : 'text-gray-500'
                }`}>
                  {option.price}
                </div>
              </div>
              {value === option.value && (
                <div className={`w-4 h-4 rounded-full bg-${option.color}-500 flex items-center justify-center`}>
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      <p className="text-xs text-gray-500">
        💡 Precios de referencia en Pesos Argentinos (ARS) por litro
      </p>
    </div>
  );
};

export default FuelTypeSelector;
