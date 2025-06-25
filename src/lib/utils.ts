import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { APP_CONFIG } from "@/constants/app";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to DD-MM-YYYY format
 */
export function formatDate(dateString: string): string {
  console.log('🗓️ formatDate - Original dateString:', dateString, 'type:', typeof dateString);
  
  if (!dateString || dateString === null || dateString === undefined) {
    console.log('❌ formatDate - Empty or null date');
    return 'Invalid Date';
  }
  
  const parsed = dayjs(dateString);
  console.log('🗓️ formatDate - Parsed date valid?', parsed.isValid());
  
  if (!parsed.isValid()) {
    console.log('❌ formatDate - Invalid date, trying alternative parsing');
    // Try parsing as ISO date if it's not working
    const isoTry = new Date(dateString);
    if (!isNaN(isoTry.getTime())) {
      const result = dayjs(isoTry).format("DD-MM-YYYY");
      console.log('✅ formatDate - Alternative parsing successful:', result);
      return result;
    }
    return 'Invalid Date';
  }
  
  const result = parsed.format("DD-MM-YYYY");
  console.log('✅ formatDate - Final result:', result);
  return result;
}

/**
 * Calculate fuel consumption for a given distance and efficiency
 * @param distance - Distance in kilometers
 * @param fuelEfficiency - Fuel efficiency in km/l
 * @returns Fuel consumption in liters
 */
export function calculateFuelConsumption(distance: number, fuelEfficiency: number): number {
  return distance / fuelEfficiency;
}

/**
 * Calculate trip cost based on distance, fuel efficiency, and fuel type
 * @param distance - Distance in kilometers
 * @param fuelEfficiency - Fuel efficiency in km/l (defaults to APP_CONFIG value)
 * @param fuelType - Type of fuel (defaults to 'Nafta Super')
 * @returns Cost in ARS
 */
export function calculateTripCost(distance: number, fuelEfficiency?: number, fuelType?: string): number {
  const efficiency = fuelEfficiency || APP_CONFIG.CAR.FUEL_CONSUMPTION;
  const fuel = fuelType || APP_CONFIG.FUEL.DEFAULT_TYPE;
  const fuelPrice = APP_CONFIG.FUEL.PRICES_ARS[fuel as keyof typeof APP_CONFIG.FUEL.PRICES_ARS] || 1200; // ARS per liter
  return (distance / efficiency) * fuelPrice;
}

/**
 * Format currency value in ARS
 */
export function formatCurrency(amount: number): string {
  return `$ ${amount.toFixed(2)} ARS`;
}

/**
 * Format fuel efficiency value with unit
 * @param efficiency - Fuel efficiency in km/l
 * @returns Formatted string with unit
 */
export function formatFuelEfficiency(efficiency: number): string {
  return `${efficiency.toFixed(1)} km/l`;
}

/**
 * Get efficiency category for display purposes
 * @param efficiency - Fuel efficiency in km/l
 * @returns Category string
 */
export function getEfficiencyCategory(efficiency: number): string {
  if (efficiency >= 20) return 'Muy Eficiente';
  if (efficiency >= 15) return 'Eficiente';
  if (efficiency >= 10) return 'Normal';
  return 'Poco Eficiente';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
