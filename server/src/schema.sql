-- Metrics: Time-series data for the dashboard
CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    label TEXT NOT NULL,   -- e.g., "Sales", "Visitors"
    value REAL NOT NULL,   -- The number
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insights: Context-aware Q&A interactions
CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    prompt TEXT NOT NULL,  -- User question
    answer TEXT,           -- AI response (can be null initially)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users: Authentication & data ownership
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);