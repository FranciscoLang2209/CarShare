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

const FormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4)
})

export default function Register() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: ""
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(data);
	}

	return (
		<div className="w-full h-screen flex items-center justify-center px-4 ">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Registrarse</CardTitle>
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
							<Button className="w-full" type="submit">Registrarse</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
