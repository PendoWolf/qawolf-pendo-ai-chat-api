import type { IncomingChatMessage, Trip } from "../types.js";

/**
 * Writes the Tripwise Assistant's reply to the latest user message.
 *
 * This build answers from a small set of travel rules instead of calling a language model, so the API runs
 * with no model key. The route only depends on this function's signature, so a model-backed version can
 * replace it.
 */
export function writeAssistantReply(messages: IncomingChatMessage[], upcomingTrips: Trip[]): string {
  const latest = [...messages].reverse().find((message) => message.role === "user");
  const prompt = latest?.content.trim().toLowerCase() ?? "";
  const nextTrip = upcomingTrips[0];

  if (prompt === "") {
    return "Hi! I'm the Tripwise Assistant. Ask me about itineraries, packing or cheaper places to go.";
  }
  if (prompt.includes("itinerary")) {
    const place = nextTrip ? nextTrip.destination : "your destination";
    return [
      `Here's a simple 3-day plan for ${place}:`,
      "Day 1: walk the old town and get your bearings.",
      "Day 2: a museum in the morning and a food market in the afternoon.",
      "Day 3: a half-day trip out of the city, back for dinner.",
    ].join("\n");
  }
  if (prompt.includes("pack")) {
    return "Pack layers, a waterproof jacket, comfortable walking shoes, a power adapter and a reusable water bottle.";
  }
  if (prompt.includes("cheap") || prompt.includes("budget") || prompt.includes("alternative")) {
    return "Try shoulder season, fly midweek, and look at a nearby city with the same feel for a lower price, like Porto instead of Lisbon.";
  }
  if (nextTrip) {
    return `Your next trip is ${nextTrip.destination} from ${nextTrip.startDate} to ${nextTrip.endDate}. What would you like to plan for it?`;
  }
  return "Tell me where you're going and when, and I'll help you plan it.";
}
