/** A planned trip, as the Tripwise web app lists it. */
export interface Trip {
  id: string;
  destination: string;
  /** ISO date, such as "2026-11-03". */
  startDate: string;
  /** ISO date, on or after startDate. */
  endDate: string;
  travelers: number;
}

/** The body of POST /api/trips. */
export type NewTrip = Omit<Trip, "id">;

export type ChatRole = "user" | "assistant";

/** One message of a conversation, as the web app sends it. */
export interface IncomingChatMessage {
  role: ChatRole;
  content: string;
}

/** The body of POST /api/assistant/chat. */
export interface ChatRequest {
  conversationId: string;
  messages: IncomingChatMessage[];
}

/** The assistant's reply, as POST /api/assistant/chat returns it. */
export interface ChatReply {
  conversationId: string;
  message: { id: string; role: "assistant"; content: string };
}
