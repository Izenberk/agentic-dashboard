import { createClient } from "@libsql/client";

export const db = createClient({
    url: process.env.TURSO_DATABASE_URL || "file:local.db",
});

console.log("💽 Database connected!");