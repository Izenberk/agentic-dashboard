import Elysia from "elysia";
import cors from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";
import { hash, compare } from "bcryptjs";
import { db } from "./db";

// Helper to extract user ID from JWT
async function getUserId(authHeader: string | undefined, jwtVerify: (token: string) => Promise<any>): Promise<number | null> {
    if (!authHeader?.startsWith("Bearer ")) return null;
    const token = authHeader.slice(7);
    const payload = await jwtVerify(token);
    return payload?.id || null;
}

const app = new Elysia()
    .use(cors())
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET || 'dev-secret-change-in-production'
    }))
    .get("/", () => "Hello from the Agentic Dashboard!")

    // Health check
    .get("/health", () => ({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    }))

    // Auth: Register
    .post("/api/auth/register", async ({ body, set }) => {
        const { email, password } = body as { email: string; password: string };
        const passwordHash = await hash(password, 10);

        try {
            await db.execute({
                sql: "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                args: [email, passwordHash]
            });
            return { success: true, message: "User registered" };
        } catch (error) {
            set.status = 400;
            return { success: false, error: "Email already exists" };
        }
    })

    // Auth: Login
    .post("/api/auth/login", async ({ body, jwt, set }) => {
        const { email, password } = body as { email: string; password: string };

        const result = await db.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [email]
        });

        const user = result.rows?.[0] as unknown as { id: number; password_hash: string } | undefined;

        if (!user) {
            set.status = 401;
            return { success: false, error: "Invalid email or password" };
        }

        const validPassword = await compare(password, user.password_hash);
        if (!validPassword) {
            set.status = 401;
            return { success: false, error: "Invalid email or password" };
        }

        const token = await jwt.sign({ id: user.id });
        return { success: true, token };
    })

    // Auth: Me (Get Current User)
    .get("/api/auth/me", async ({ jwt, headers, set }) => {
        const userId = await getUserId(headers.authorization, jwt.verify);
        if (!userId) {
            set.status = 401;
            return { success: false, error: "Invalid token" };
        }
        return { success: true, userId };
    })

    // GET /api/metrics - Fetch user's data for charts
    .get("/api/metrics", async ({ jwt, headers, set }) => {
        const userId = await getUserId(headers.authorization, jwt.verify);
        if (!userId) {
            set.status = 401;
            return { success: false, error: "Unauthorized" };
        }

        const result = await db.execute({
            sql: "SELECT * FROM metrics WHERE user_id = ? ORDER BY timestamp ASC",
            args: [userId]
        });
        return result.rows;
    })

    // POST /api/chat - User asks a question
    .post("/api/chat", async ({ body, jwt, headers, set }) => {
        const userId = await getUserId(headers.authorization, jwt.verify);
        if (!userId) {
            set.status = 401;
            return { success: false, error: "Unauthorized" };
        }

        const { prompt } = body as { prompt: string };

        const result = await db.execute({
            sql: "INSERT INTO insights (user_id, prompt) VALUES (?, ?) RETURNING id",
            args: [userId, prompt]
        });

        const firstRow = result.rows?.[0];
        if (!firstRow) {
            return { success: false, error: "Failed to create insight" };
        }

        const insightId = (firstRow as unknown as { id: number }).id;

        // Trigger n8n workflow (fire and forget)
        const n8nUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nUrl) {
            fetch(n8nUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, insightId })
            }).catch(err => console.error("Failed to trigger n8n:", err));
        }

        return { success: true, insightId };
    })

    // POST /api/chat/webhook - n8n returns the answer (no auth - internal)
    .post("/api/chat/webhook", async ({ body }) => {
        const { insightId, answer } = body as { insightId: number, answer: string };

        await db.execute({
            sql: "UPDATE insights SET answer = ? WHERE id = ?",
            args: [answer, insightId]
        });

        return { success: true };
    })

    // GET /api/chat/history - Fetch user's conversation
    .get("/api/chat/history", async ({ jwt, headers, set }) => {
        const userId = await getUserId(headers.authorization, jwt.verify);
        if (!userId) {
            set.status = 401;
            return { success: false, error: "Unauthorized" };
        }

        const result = await db.execute({
            sql: "SELECT * FROM insights WHERE user_id = ? ORDER BY created_at DESC",
            args: [userId]
        });
        return result.rows;
    })

    .listen(3000);

console.log(
    `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;