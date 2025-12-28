-- Sprint 3: Workspaces Schema Additions

-- Workspaces: Organize user data into separate workspaces
CREATE TABLE IF NOT EXISTS workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    owner_id INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add workspace_id to metrics table
ALTER TABLE metrics ADD COLUMN workspace_id INTEGER REFERENCES workspaces(id);

-- Add workspace_id to insights table
ALTER TABLE insights ADD COLUMN workspace_id INTEGER REFERENCES workspaces(id);

-- Files: track uploaded files (CSV imports, etc.)
CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER REFERENCES workspaces(id),
    user_id INTEGER REFERENCES users(id),
    filename TEXT NOT NULL,
    mime_type TEXT,
    size_bytes INTEGER,
    rows_imported INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI Tasks: Track async AI processing status
CREATE TABLE IF NOT EXISTS ai_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER REFERENCES workspaces(id),
    user_id INTEGER REFERENCES users(id),
    insight_id INTEGER REFERENCES insights(id),
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    started_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);