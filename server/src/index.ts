import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { db } from "./db";

const app = new Elysia()
    .use(cors())
    .get("/", () => "Hello from the Agentic Dashboard!")

    // N8N Webhook Receiver
    .post("/api/webhook/:workflowId", async ({ params, body }) => {
        const { workflowId } = params;
        const data = body as { status: string; logs?: string[] };
        const runId = crypto.randomUUID();

        console.log(`📥 Webhook received for ${workflowId}`);

        try {
            // 1. Auto-register workflow if it doesn't exist
            await db.execute({
                sql: "INSERT OR IGNORE INTO workflows (id, name) VALUES (?,?)",
                args: [workflowId, `Auto-Workflow-${workflowId.substring(0, 4)}`]
            });

            // 2. Record the Run
            await db.execute({
                sql: "INSERT INTO runs (id, workflow_id, status, completed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
                args: [runId, workflowId, data.status || 'completed']
            });

            // 3. Record Logs
            if (data.logs && Array.isArray(data.logs)) {
                for (const log of data.logs) {
                    await db.execute({
                        sql: "INSERT INTO logs (run_id, message) VALUES (?,?)",
                        args: [runId, log]
                    });
                }
            }

            return { success: true, runId };
        } catch (error) {
            console.error(error);
            return { success: false, error: "Database error" };
        }
    })

    // GET /api/runs - Fetch recent runs
    .get("/api/runs", async () => {
        const result = await db.execute(`
            SELECT
                runs.id,
                runs.status,
                runs.completed_at,
                workflows.name as workflow_name
            FROM runs
            JOIN workflows ON runs.workflow_id = workflows.id
            ORDER BY runs.created_at DESC
            LIMIT 50    
        `);
        return result.rows;
    })

    .listen(3000);

console.log(
    `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;