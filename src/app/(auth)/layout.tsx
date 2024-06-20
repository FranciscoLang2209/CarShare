export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-5">
			<div className="col-span-2 bg-slate-900 min-h-screen"></div>
			{children}
		</div>
	)
} 
