"use client";
import { useAuth } from "@/hooks/useAuth"

export default function Page() {
	const { user } = useAuth();

	return (
		<main>
			<p>{user && user}</p>
		</main>
	)
}
