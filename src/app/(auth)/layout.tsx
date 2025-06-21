import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'CarShare - Autenticación',
  description: 'Inicia sesión o regístrate en CarShare',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
}
