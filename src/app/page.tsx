import TripList from "@/components/trip-list";
import Stats from "@/components/stats";
import { Toaster } from "@/components/ui/toaster";

export default function Page() {
  return (
    <main className="container mx-auto flex gap-5 mt-10 flex-col">
      <Stats />
      <TripList />
      <Toaster />
    </main>
  );
}
