"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { User } from "@/types"
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation"

const FormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4)
})

export default function Login() {
	const { setUser, setName } = useAuth();
	const router = useRouter()
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: ""
		},
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			const res = await fetch("http://localhost:5000/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const response = await res.json();
			const user: User = response.user;
			setUser(user._id);
			setName(user.name)
			Cookies.set('user', user._id, { expires: 1 }); // Expires in 1 day
			Cookies.set('name', user.name, { expires: 1 }); // Expires in 1 day
			router.push("/");
		} catch (err) {
			console.error("Error login: ", err);
		}
	}

	return (
		<div className="w-full h-screen flex items-center justify-center px-4 bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Iniciar Sesión</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contraseña</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button className="w-full" type="submit">Iniciar Sesión</Button>
						</form>
					</Form>
					<p className="text-center mt-3 font-light text-sm">¿No tienes una cuenta? <Link href="/register" className="font-bold ms-1 text-slate">Registrarse</Link></p>
				</CardContent>
			</Card>
		</div>
	)
}

