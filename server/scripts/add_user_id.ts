import { db } from "../src/db";

console.log("🔄 Running migration: Adding user_id columns...");

try {
    // SQLite doesn't support ALTER TABLE ADD COLUMN with FK easily
    // So we use a workaround: check if column exists, if not add it

    // Add user_id to metrics
    try {
        await db.execute("ALTER TABLE metrics ADD COLUMN user_id INTEGER REFERENCES users(id)");
        console.log("✅ Added user_id to metrics");
    } catch (e: any) {
        if (e.message?.includes("duplicate column")) {
            console.log("ℹ️  user_id already exists in metrics");
        } else {
            throw e;
        }
    }

    // Add user_id to insights
    try {
        await db.execute("ALTER TABLE insights ADD COLUMN user_id INTEGER REFERENCES users(id)");
        console.log("✅ Added user_id to insights");
    } catch (e: any) {
        if (e.message?.includes("duplicate column")) {
            console.log("ℹ️  user_id already exists in insights");
        } else {
            throw e;
        }
    }

    console.log("🎉 Migration complete!");
} catch (error) {
    console.error("❌ Migration failed:", error);
}
