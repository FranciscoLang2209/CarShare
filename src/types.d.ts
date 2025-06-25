export interface User {
	id: string;
	name: string;
	email: string;
}

export interface Car {
	id: string;
	model: string;
	brand: string;
	year: number;
	fuelEfficiency: number;
	admin: User;
	users: User[];
}

export interface CreateCarData {
	model: string;
	brand: string;
	year: number;
	fuelEfficiency?: number;
	users: string[];
	admin?: string; // Admin user ID - will be set automatically
}

export interface Session {
	id: string;
	user: User;
	distance: number;
	startTime: string;
	endTime?: string;
	start_time?: string; // Backward compatibility
	end_time?: string; // Backward compatibility
	car?: Car; // Optional car information for enhanced cost calculation
	isActive?: boolean; // Added based on backend API response
}

export interface AuthContextType {
	user: string | null;
	name: string | null;
	setUser: (user: string) => void;
	setName: (name: string) => void;
	logout: () => void;
	isLoading: boolean;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface StatsData {
	totalCost: number;
	totalDistance: number;
	fuelConsumption: number;
}
