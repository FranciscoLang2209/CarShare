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
 * Calculate trip cost based on distance
 */
export function calculateTripCost(distance: number): number {
  return (
    (distance / APP_CONFIG.CAR.FUEL_CONSUMPTION) *
    APP_CONFIG.CAR.COST_PER_KM_FACTOR
  );
}

/**
 * Format currency value
 */
export function formatCurrency(amount: number): string {
  return `$ ${amount.toFixed(2)}`;
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
