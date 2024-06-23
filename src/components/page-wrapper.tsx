"use client";
import { AuthProvider } from "@/context/AuthContext";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			{children}
		</AuthProvider>
	)
}
