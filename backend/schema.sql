-- Prize Draws Table
CREATE TABLE IF NOT EXISTS draws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    prize_description TEXT NOT NULL,
    prize_image_url TEXT,
    value REAL,
    type TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    eligibility_criteria TEXT,
    status TEXT DEFAULT 'draft', -- draft, active, closed, completed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Entries Table
CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    draw_id INTEGER NOT NULL,
    customer_id TEXT NOT NULL, -- Simulated customer ID
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    entry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (draw_id) REFERENCES draws(id),
    UNIQUE(draw_id, customer_email) -- Prevent duplicate entries per draw
);

-- Winners Table
CREATE TABLE IF NOT EXISTS winners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    draw_id INTEGER NOT NULL,
    entry_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- primary, reserve
    rank INTEGER, -- 1 for primary, 1-10 for reserves
    status TEXT DEFAULT 'pending', -- pending, notified, claimed, forfeited
    selected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (draw_id) REFERENCES draws(id),
    FOREIGN KEY (entry_id) REFERENCES entries(id)
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT,
    performed_by TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
