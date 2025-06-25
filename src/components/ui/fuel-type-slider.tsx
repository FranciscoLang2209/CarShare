import React from 'react';

interface FuelTypeSliderProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FuelTypeSlider: React.FC<FuelTypeSliderProps> = ({ value, onChange, error }) => {
  console.log('� FuelTypeSlider RENDERING!', { value, error });
  
  return (
    <div className="w-full p-6 my-4 bg-red-100 border-4 border-red-500 rounded-lg">
      <h2 className="text-xl font-bold text-red-800 mb-4">
        🚨 FUEL TYPE SLIDER - SI VES ESTO, EL COMPONENTE FUNCIONA! 🚨
      </h2>
      
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-red-700">
          Tipo de Combustible: {value}
        </label>
        
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => {
              console.log('🔥 Clicking Nafta Super');
              onChange('Nafta Super');
            }}
            className={`p-4 border-2 rounded font-bold ${
              value === 'Nafta Super' 
                ? 'bg-green-500 text-white border-green-700' 
                : 'bg-white text-green-700 border-green-500 hover:bg-green-50'
            }`}
          >
            Nafta Super
            <br />
            <span className="text-sm">$1,200/L</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              console.log('🔥 Clicking Nafta Premium');
              onChange('Nafta Premium');
            }}
            className={`p-4 border-2 rounded font-bold ${
              value === 'Nafta Premium' 
                ? 'bg-blue-500 text-white border-blue-700' 
                : 'bg-white text-blue-700 border-blue-500 hover:bg-blue-50'
            }`}
          >
            Nafta Premium
            <br />
            <span className="text-sm">$1,400/L</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              console.log('🔥 Clicking Diesel');
              onChange('Diesel');
            }}
            className={`p-4 border-2 rounded font-bold ${
              value === 'Diesel' 
                ? 'bg-orange-500 text-white border-orange-700' 
                : 'bg-white text-orange-700 border-orange-500 hover:bg-orange-50'
            }`}
          >
            Diesel
            <br />
            <span className="text-sm">$1,250/L</span>
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-200 border border-red-400 rounded text-red-800">
            ❌ Error: {error}
          </div>
        )}
        
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          💡 Precios en Pesos Argentinos (ARS) por litro
        </div>
      </div>
    </div>
  );
};

export default FuelTypeSlider;
