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
import dayjs from "dayjs";

const getSessions = async () => {
	try {
		const res = await fetch("http://localhost:3001/user/sessions", { cache: 'no-store' })
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
						{sessions && sessions.map((session: any, index: number) => (
							<TableRow key={session.id || index} className={index % 2 == 0 ? "bg-accent" : ""}>
								<TableCell>{session.user.name}</TableCell>
								<TableCell className="hidden sm:table-cell">{session.distance} km</TableCell>
								<TableCell className="hidden md:table-cell">{dayjs(session.start_time).format("DD-MM-YYYY")}</TableCell>
								<TableCell className="text-right">$ {((session.distance / 11.5) * 1013).toFixed(2)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}