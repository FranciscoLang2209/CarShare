import React, { createContext, useState } from "react";
import Cookies from "js-cookie";


type AuthContextType = {
	user: string | null;
	setUser: (user: string) => void;
}

const defaultContext = {
	user: null,
	setUser: (user: string) => { }
}

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<string | null>(Cookies.get("user") || null);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	)
}

