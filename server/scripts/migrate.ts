import { db } from "../src/db";
import { join } from "path";

console.log("🚀 Starting migration...");

try {
    // Read the SQL file
    const schemaPath = join(import.meta.dir, "../src/schema.sql");
    const schema = await Bun.file(schemaPath).text();

    // Split by semicolon to run multiple statements (LibSQL limitations vary)
    // But for local SQLite, we can often run it as a transaction or one-by-one.
    // Let's keep it simple: run the whole block.
    await db.executeMultiple(schema);

    console.log("✅ Schema applied successfully!");    
} catch (error) {
    console.error("❌ Migration failed", error);
}
