"use client";

import React, { memo } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Header from "./header";

interface PageWrapperProps {
	children: React.ReactNode;
}

const PageWrapper = memo(({ children }: PageWrapperProps) => {
	return (
		<AuthProvider>
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="pt-20">
					{children}
				</main>
			</div>
		</AuthProvider>
	);
});

PageWrapper.displayName = 'PageWrapper';

export default PageWrapper;
