"use client";

import React, { memo, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Car as CarIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

const Header = memo(() => {
	const { user, name, logout } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch by only rendering after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	const handleGoHome = () => {
		router.push("/");
	};

	// Don't show header on auth pages
	if (pathname === '/login' || pathname === '/register') {
		return null;
	}

	// Don't show header if not mounted or user is not logged in
	if (!mounted || !user || !name) {
		return null;
	}

	return (
		<header className="fixed top-0 left-0 right-0 z-50 border-b bg-white shadow-sm">
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between">
					{/* Left side - Logo/Brand */}
					<div className="flex items-center gap-3">
						<button 
							onClick={handleGoHome}
							className="flex items-center gap-2 hover:opacity-80 transition-opacity"
						>
							<CarIcon className="h-6 w-6 text-primary" />
							<span className="text-xl font-bold text-gray-900">CarShare</span>
						</button>
					</div>

					{/* Right side - User info and logout */}
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<UserIcon className="h-4 w-4 text-gray-600" />
							<span className="text-sm font-medium text-gray-700">{name}</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleLogout}
							className="flex items-center gap-2"
						>
							<LogOut className="h-4 w-4" />
							Salir
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
});

Header.displayName = 'Header';

export default Header;
