import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageWrapper from "@/components/page-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "CarShare",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<PageWrapper>
				<body className={inter.className}>{children}</body>
			</PageWrapper>
		</html>
	);
}
