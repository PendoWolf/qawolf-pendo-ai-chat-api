import { randomUUID } from "node:crypto";
import type { NewTrip, Trip } from "../types.js";

// Trips live in memory: they reset whenever the API restarts. A real deployment
// would swap this module for a database without touching the routes.
const trips = new Map<string, Trip>();

const seedTrips: NewTrip[] = [
  { destination: "Lisbon, Portugal", startDate: "2026-11-03", endDate: "2026-11-08", travelers: 2 },
  { destination: "Kyoto, Japan", startDate: "2027-04-01", endDate: "2027-04-10", travelers: 1 },
];
for (const trip of seedTrips) {
  const id = randomUUID();
  trips.set(id, { id, ...trip });
}

export const tripStore = {
  list(): Trip[] {
    return [...trips.values()].sort((a, b) => a.startDate.localeCompare(b.startDate));
  },
  create(trip: NewTrip): Trip {
    const id = randomUUID();
    const created: Trip = { id, ...trip };
    trips.set(id, created);
    return created;
  },
  /** Deletes the trip, and returns false when there was none with that id. */
  remove(id: string): boolean {
    return trips.delete(id);
  },
  upcoming(): Trip[] {
    const today = new Date().toISOString().slice(0, 10);
    return this.list().filter((trip) => trip.endDate >= today);
  },
};
