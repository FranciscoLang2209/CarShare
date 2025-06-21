import React from "react";
import TripList from "@/components/trip-list";
import Stats from "@/components/stats";
import { Toaster } from "@/components/ui/toaster";

export default function HomePage() {
  return (
    <main 
      className="container mx-auto flex gap-5 mt-10 flex-col"
      role="main"
      aria-label="Panel principal de CarShare"
    >
      <h1 className="sr-only">CarShare - Panel Principal</h1>
      <Stats />
      <TripList />
      <Toaster />
    </main>
  );
}
