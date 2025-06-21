export interface User {
	_id: string;
	name: string;
	email: string;
}

export interface Session {
	id: string;
	user: User;
	distance: number;
	start_time: string;
	end_time?: string;
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
