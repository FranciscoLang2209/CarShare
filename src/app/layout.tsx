import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageWrapper from "@/components/page-wrapper";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CarShare",
  description: "Sistema de compartición de vehículos",
  keywords: ["carshare", "vehículos", "compartir", "transporte"],
  authors: [{ name: "CarShare Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className={inter.variable}>
      <PageWrapper>
        <body className={inter.className} suppressHydrationWarning>
          {children}
        </body>
      </PageWrapper>
    </html>
  );
}
