import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/types";
import { useContext } from "react";

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	
	return context;
};

export const useRequireAuth = (): AuthContextType & { user: string; name: string } => {
	const auth = useAuth();
	
	if (!auth.user || !auth.name) {
		throw new Error('User must be authenticated to use this hook');
	}
	
	return auth as AuthContextType & { user: string; name: string };
};
