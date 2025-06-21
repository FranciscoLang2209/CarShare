"use client";

import React, { memo } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { RegisterSchema, RegisterFormData } from "@/schemas/auth";
import { useAuthForm } from "@/hooks/useAuthForm";

const Register = memo(() => {
	const { register: registerUser, isLoading, error } = useAuthForm();
	
	const form = useForm<RegisterFormData>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: "",
			email: "",
			password: ""
		},
	});

	const onSubmit = async (data: RegisterFormData) => {
		await registerUser(data);
	};

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
											<Input 
												{...field} 
												disabled={isLoading}
												aria-describedby={form.formState.errors.name ? "name-error" : undefined}
											/>
										</FormControl>
										<FormMessage id="name-error" />
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
											<Input 
												type="email" 
												{...field} 
												disabled={isLoading}
												aria-describedby={form.formState.errors.email ? "email-error" : undefined}
											/>
										</FormControl>
										<FormMessage id="email-error" />
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
											<Input 
												type="password" 
												{...field} 
												disabled={isLoading}
												aria-describedby={form.formState.errors.password ? "password-error" : undefined}
											/>
										</FormControl>
										<FormMessage id="password-error" />
									</FormItem>
								)}
							/>

							{error && (
								<div 
									className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200"
									role="alert"
									aria-live="polite"
								>
									{error}
								</div>
							)}

							<Button 
								className="w-full" 
								type="submit" 
								disabled={isLoading}
								aria-label={isLoading ? "Registrando..." : "Registrarse"}
							>
								{isLoading ? "Registrando..." : "Registrarse"}
							</Button>
						</form>
					</Form>
					<p className="text-center mt-3 font-light text-sm">
						¿Ya tienes una cuenta? 
						<Link 
							href="/login" 
							className="font-bold ms-1 text-blue-600 hover:text-blue-800 underline"
						>
							Iniciar sesión
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
});

Register.displayName = 'Register';

export default Register;
