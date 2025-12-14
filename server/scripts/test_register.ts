import { db } from "../src/db";
import { hash } from "bcryptjs";

console.log("Testing registration...");

try {
    const email = "testdirect@example.com";
    const password = "password123";

    console.log("Hashing password...");
    const passwordHash = await hash(password, 10);
    console.log("Password hashed:", passwordHash.substring(0, 20) + "...");

    console.log("Inserting into database...");
    await db.execute({
        sql: "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        args: [email, passwordHash]
    });

    console.log("✅ Registration successful!");

    // Verify
    const result = await db.execute("SELECT * FROM users");
    console.log("Users in DB:", result.rows);

} catch (error) {
    console.error("❌ Registration failed:");
    console.error(error);
}
