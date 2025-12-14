import { db } from "../src/db";

const result = await db.execute("SELECT * FROM users");
console.log("Users in DB:", result.rows);
