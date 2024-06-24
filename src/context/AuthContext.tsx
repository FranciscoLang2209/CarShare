import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";


type AuthContextType = {
	user: string | null;
	name: string | null;
	setUser: (user: string) => void;
	setName: (name: string) => void;
}

const defaultContext = {
	user: null,
	name: null,
	setName: (name: string) => { },
	setUser: (user: string) => { }
}

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<string | null>(null);
	const [name, setName] = useState<string | null>(null);

	useEffect(() => {
		setName(Cookies.get("name") || null);
		setUser(Cookies.get("user") || null);
	}, [])

	return (
		<AuthContext.Provider value={{ user, setUser, name, setName }}>
			{children}
		</AuthContext.Provider>
	)
}

