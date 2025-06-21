"use client";

import React, { memo } from "react";
import { AuthProvider } from "@/context/AuthContext";

interface PageWrapperProps {
	children: React.ReactNode;
}

const PageWrapper = memo(({ children }: PageWrapperProps) => {
	return (
		<AuthProvider>
			{children}
		</AuthProvider>
	);
});

PageWrapper.displayName = 'PageWrapper';

export default PageWrapper;
