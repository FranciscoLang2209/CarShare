import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
	return (
		<div className="flex col-span-3 min-h-screen items-center justify-center flex-col gap-2">
			<h1 className="font-bold text-lg">Iniciar Sesión</h1>
			<form className="flex flex-col gap-3">
				<Input />
				<Input />
				<Button>Iniciar Sesión</Button>
			</form>
		</div>
	)
}
