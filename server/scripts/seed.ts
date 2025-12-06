import { db } from "../src/db";

console.log("🌱 Seeding data...");

// Clear existing data
await db.execute("DELETE FROM metrics");
await db.execute("DELETE FROM insights");

const labels = ["Sales", "Visitors", "Signups"];
const dataPoints = [];

// Generate 30 days of data
for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const timestamp = date.toISOString();

    for (const label of labels) {
        let base = label === "Sales" ? 1000 : label === "Visitors" ? 5000 : 50;
        let value = Math.floor(base + (Math.random() * base * 0.5));

        dataPoints.push({
            sql: "INSERT INTO metrics (label, value, timestamp) VALUES (?, ?, ?)",
            args: [label, value, timestamp] 
        });
    }
}

// Insert in batches
for (const point of dataPoints) {
    await db.execute(point);
}

console.log(`✅ Seeded ${dataPoints.length} metrics!`);