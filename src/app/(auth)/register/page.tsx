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
	name: z.string().min(4),
	email: z.string().email(),
	password: z.string().min(4)
})

export default function Register() {
	const { setUser } = useAuth();
	const router = useRouter();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: ""
		},
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(JSON.stringify(data))
		try {
			const res = await fetch("http://localhost:5000/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const user: User = await res.json();
			setUser(user._id);
			Cookies.set('user', user._id, { expires: 1 }); // Expires in 1 day
			router.push("/");
		} catch (err) {
			console.error("Error register: ", err);
		}
	}

	return (
		<div className="w-full h-screen flex items-center justify-center px-4 bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Registrarse</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
							<Button className="w-full" type="submit">Registrarse</Button>
						</form>
					</Form>
					<p className="text-center mt-3 font-light text-sm">¿Ya tienes una cuenta? <Link href="/login" className="font-bold ms-1 text-slate">Iniciar sesión</Link></p>
				</CardContent>
			</Card>
		</div>
	)
}
