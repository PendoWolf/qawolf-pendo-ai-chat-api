# Tripwise API

The backend for **Tripwise**, a trip-planning web app with an AI travel assistant. This repo
is the **API only**: a Node + Express + TypeScript service that serves JSON. It has no web
pages of its own.

The web app that calls it lives in its own repo, `PendoWolf/qawolf-pendo-ai-chat-frontend`
(a Vite + React app). Run the two side by side:

| Repo | Runs on | Talks to |
| --- | --- | --- |
| `qawolf-pendo-ai-chat-frontend` (`web/`) | http://localhost:5173 | this API at its `VITE_API_URL` |
| `qawolf-pendo-ai-chat-api` (this repo) | http://localhost:3001 | nothing else |

The web app's `VITE_API_URL` defaults to `http://localhost:3001`, this API's default port, and
this API allows the web app's origin (`CORS_ORIGIN`, default `http://localhost:5173`).

## Endpoints

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `GET` | `/api/trips` | | `Trip[]` |
| `POST` | `/api/trips` | `{ destination, startDate, endDate, travelers }` | `201` and the `Trip` |
| `DELETE` | `/api/trips/:id` | | `204`, or `404` when there's no such trip |
| `POST` | `/api/assistant/chat` | `{ conversationId, messages: [{ role, content }] }` | `{ conversationId, message: { id, role: "assistant", content } }` |
| `GET` | `/health` | | `{ status: "ok" }` |

`Trip` is `{ id, destination, startDate, endDate, travelers }`, with dates like `2026-11-03`.
A bad request gets `400` and `{ error }`.

## Tripwise Assistant

`POST /api/assistant/chat` answers the web app's "Tripwise Assistant" chat panel. The web app
sends the whole conversation each time, so the API keeps no chat state. This build writes the
reply from a few travel rules (`src/assistant/reply.ts`) instead of calling a language model,
so it runs with no model key.

## Structure

- `src/index.ts` starts the server
- `src/app.ts` builds the Express app (CORS, JSON, routes)
- `src/routes/` the trips and assistant routes
- `src/store/trips.ts` an in-memory trip store, seeded with two trips
- `src/assistant/reply.ts` the assistant's replies

## Run

```bash
npm install
npm run dev     # http://localhost:3001
npm run build && npm start
```

## Configuration

| Var | Purpose | Default |
| --- | --- | --- |
| `PORT` | Port the API listens on | `3001` |
| `CORS_ORIGIN` | Origin of the Tripwise web app | `http://localhost:5173` |
