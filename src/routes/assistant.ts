import { randomUUID } from "node:crypto";
import { Router } from "express";
import { writeAssistantReply } from "../assistant/reply.js";
import { tripStore } from "../store/trips.js";
import type { ChatReply, ChatRequest } from "../types.js";

export const assistantRouter = Router();

// The web app sends the whole conversation each time, so the API keeps no chat state of its own.
assistantRouter.post("/chat", (req, res) => {
  const body = req.body as Partial<ChatRequest> | undefined;
  if (!body || typeof body.conversationId !== "string" || !Array.isArray(body.messages)) {
    res.status(400).json({ error: "conversationId and messages are required" });
    return;
  }
  const messages = body.messages.filter(
    (message) =>
      (message?.role === "user" || message?.role === "assistant") && typeof message.content === "string",
  );
  const reply: ChatReply = {
    conversationId: body.conversationId,
    message: {
      id: randomUUID(),
      role: "assistant",
      content: writeAssistantReply(messages, tripStore.upcoming()),
    },
  };
  res.json(reply);
});
