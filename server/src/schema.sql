-- Metrics: Time-series data for the dashboard
CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,   -- e.g., "Sales", "Visitors"
    value REAL NOT NULL,   -- The number
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insights: Context-aware Q&A interactions
CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt TEXT NOT NULL,  -- User question
    answer TEXT,           -- AI response (can be null initially)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);