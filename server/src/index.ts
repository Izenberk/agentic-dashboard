import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { db } from "./db";

const app = new Elysia()
    .use(cors())
    .get("/", () => "Hello from the Agentic Dashboard!")

    // 1. GET /api/metrics - Fetch data for the charts
    .get("/api/metrics", async () => {
        const result = await db.execute("SELECT * FROM metrics ORDER BY timestamp ASC");
        return result.rows;
    })

    // 2. POST /api/chat - User asks a question
    .post("/api/chat", async ({ body }) => {
        const { prompt } = body as { prompt: string };

        // Log the question to DB
        const result = await db.execute({
            sql: "INSERT INTO insights (prompt) VALUES (?) RETURNING id",
            args: [prompt]
        });

        const firstRow = result.rows?.[0];

        if (!firstRow) {
            return { success: false, error: "Failed to create insight" };
        }
        // Type assertion because LibSQL returns unknown[]
        const insightId = (firstRow as unknown as { id: number }).id;

        return { success: true, insightId };
    })

    // 3. POST /api/chat/webhook - n8n returns the answer
    .post("/api/chat/webhook", async ({ body }) => {
        const { insightId, answer } = body as { insightId: number, answer: string };

        await db.execute({
            sql: "UPDATE insights SET answer = ? WHERE id = ?",
            args: [answer, insightId]
        });

        return { success: true };
    })

    // 4. GET /api/chat/history - Fetch conversation
    .get("/api/chat/history", async () => {
        const result = await db.execute("SELECT * FROM insights ORDER BY created_at DESC");
        return result.rows as unknown as { id: number; prompt: string; answer: string | null; created_at: string }[];
    })

    .listen(3000);

console.log(
    `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;