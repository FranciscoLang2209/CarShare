'use client';

import React, { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { AuthContextType } from "@/types";
import { cookieService } from "@/services/cookies";

const defaultContext: AuthContextType = {
	user: null,
	name: null,
	setName: () => {},
	setUser: () => {},
	logout: () => {},
	isLoading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

interface AuthProviderProps {
	children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUserState] = useState<string | null>(null);
	const [name, setNameState] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize auth state from cookies
	useEffect(() => {
		const storedName = cookieService.getName();
		const storedUser = cookieService.getUser();
		
		setNameState(storedName);
		setUserState(storedUser);
		setIsLoading(false);
	}, []);

	const setUser = useCallback((userId: string) => {
		setUserState(userId);
		cookieService.setUser(userId);
	}, []);

	const setName = useCallback((userName: string) => {
		setNameState(userName);
		cookieService.setName(userName);
	}, []);

	const logout = useCallback(() => {
		setUserState(null);
		setNameState(null);
		cookieService.clearAuth();
	}, []);

	const contextValue = useMemo(
		(): AuthContextType => ({
			user,
			name,
			setUser,
			setName,
			logout,
			isLoading,
		}),
		[user, name, setUser, setName, logout, isLoading]
	);

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}

