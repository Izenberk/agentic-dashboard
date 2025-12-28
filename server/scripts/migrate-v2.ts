import { log } from "console";
import { db } from "../src/db";
import { readFileSync } from "fs";
import { join } from "path";

async function migrate() {
    console.log("🚀 Starting Sprint 3 migration...\n");

    const schemaPath = join(__dirname, "../src/schema-v2.sql");
    const schema = readFileSync(schemaPath, "utf-8");

    const statements = schema.split(";").filter(s => s.trim());

    for (const stmt of statements) {
        try {
            await db.execute(stmt);
        } catch (err: any) {
            if (err.message?.includes("duplicate column")) {
                console.log(`⏭️  Skipping (already exists): ${stmt.trim().substring(0, 50)}...`);
                
            } else {
                throw err;
            }
        }
    }

    console.log("👥 Creating workspaces for existing users...");

    const users = await db.execute("SELECT id, email FROM users");

    for (const user of users.rows as unknown as { id: number; email: string }[]) {

        const existing = await db.execute({
            sql: "SELECT id FROM workspaces WHERE owner_id = ?",
            args: [user.id]
        });

        if (existing.rows.length === 0) {
            await db.execute({
                sql: "INSERT INTO workspaces (name, owner_id) VALUES (?, ?)",
                args: [`${user.email}'s Workspace`, user.id]
            });
            console.log(` ✓ Created workspace for ${user.email}`);
        }
    }

    console.log("📈 Migrating metrics to workspaces...");
    await db.execute(`
        UPDATE metrics
        SET workspace_id = (
            SELECT w.id FROM workspaces w WHERE w.owner_id = metrics.user_id
        )
        WHERE workspace_id IS NULL
    `);

    console.log("💬 Migrating insights to workspaces...");
    await db.execute(`
        UPDATE insights
        SET workspace_id = (
            SELECT w.id FROM workspaces w WHERE w.owner_id = insights.user_id
        )
        WHERE workspace_id IS NULL
    `);

    console.log("\n✅ Sprint 3 migration complete!");



}

migrate().catch(console.error);
