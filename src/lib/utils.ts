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
  return dayjs(dateString).format("DD-MM-YYYY");
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
 * Calculate trip cost based on distance and optional fuel efficiency
 * @param distance - Distance in kilometers
 * @param fuelEfficiency - Fuel efficiency in km/l (defaults to APP_CONFIG value)
 * @returns Cost in CLP
 */
export function calculateTripCost(distance: number, fuelEfficiency?: number): number {
  const efficiency = fuelEfficiency || APP_CONFIG.CAR.FUEL_CONSUMPTION;
  const fuelPrice = 1013; // CLP per liter
  return (distance / efficiency) * fuelPrice;
}

/**
 * Format currency value
 */
export function formatCurrency(amount: number): string {
  return `$ ${amount.toFixed(2)}`;
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
