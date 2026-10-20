import cors from "cors";
import express from "express";
import { assistantRouter } from "./routes/assistant.js";
import { tripsRouter } from "./routes/trips.js";

/** Builds the Tripwise API: JSON only, no pages of its own. */
export function createApp(corsOrigin: string) {
  const app = express();
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api/trips", tripsRouter);
  app.use("/api/assistant", assistantRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "not found" });
  });
  return app;
}
