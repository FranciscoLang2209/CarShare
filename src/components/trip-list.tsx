import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

const getSessions = async () => {
	try {
		const res = await fetch("http://localhost:5000/user/sessions")
		const data = await res.json();
		console.log(data)
		return data;
	} catch (err) {
		console.error("error", err);
	}
}

export default async function TripList() {
	const sessions = await getSessions();

	return (
		<Card className="w-full">
			<CardHeader className="px-7">
				<CardTitle>Viajes</CardTitle>
				<CardDescription>Últimos viajes de Toyota Corolla</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Usuario</TableHead>
							<TableHead className="hidden sm:table-cell">Distancia</TableHead>
							<TableHead className="hidden md:table-cell">Fecha</TableHead>
							<TableHead className="text-right">Total</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sessions.map((session: any, index: number) => (
							<TableRow className={index % 2 == 0 ? "bg-accent" : ""}>
								<TableCell>{session._id}</TableCell>
								<TableCell className="hidden sm:table-cell">{session.distance}</TableCell>
								<TableCell className="hidden md:table-cell">{}</TableCell>
								<TableCell className="text-right">$250.00</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

