const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Database
const dbPath = path.resolve(__dirname, 'prize_draw_v2.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database schema', err);
        } else {
            console.log('Database schema initialized.');
        }
    });
}

// Helper for Audit Logs
function logAudit(action, details, performedBy = 'system') {
    db.run(
        `INSERT INTO audit_logs (action, details, performed_by) VALUES (?, ?, ?)`,
        [action, JSON.stringify(details), performedBy],
        (err) => {
            if (err) console.error('Audit log error:', err);
        }
    );
}

// --- API ENDPOINTS ---

// 1. Prize Draw Management

// Get all draws with entry counts
app.get('/api/draws', (req, res) => {
    const status = req.query.status;
    let query = `
        SELECT d.*, COUNT(e.id) as entries_count 
        FROM draws d 
        LEFT JOIN entries e ON d.id = e.draw_id
    `;
    let params = [];

    if (status) {
        query += ' WHERE d.status = ?';
        params.push(status);
    }

    query += ' GROUP BY d.id ORDER BY d.created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows }); // rows will now have entries_count
    });
});

// Create a new draw
app.post('/api/draws', (req, res) => {
    const { title, description, prize_description, start_date, end_date, value, type, status, eligibility_criteria } = req.body;

    if (!title || !prize_description || !start_date || !end_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `INSERT INTO draws (title, description, prize_description, start_date, end_date, value, type, status, eligibility_criteria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const drawStatus = status || 'draft';

    db.run(sql, [title, description, prize_description, start_date, end_date, value, type, drawStatus, eligibility_criteria], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        logAudit('CREATE_DRAW', { id: this.lastID, title }, 'admin');
        res.json({ id: this.lastID, status: drawStatus });
    });
});

// Publish/Update status
app.patch('/api/draws/:id/status', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.run('UPDATE draws SET status = ? WHERE id = ?', [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        logAudit('UPDATE_DRAW_STATUS', { id, status }, 'admin');
        res.json({ success: true });
    });
});


// 2. Customer Entry Submission

app.post('/api/entries', (req, res) => {
    const { draw_id, customer_email, customer_name, customer_id } = req.body;

    // Check if draw is active
    db.get('SELECT status, end_date FROM draws WHERE id = ?', [draw_id], (err, draw) => {
        if (err || !draw) return res.status(404).json({ error: 'Draw not found' });

        const now = new Date();
        const endDate = new Date(draw.end_date);

        if (draw.status !== 'active' && draw.status !== 'published') {
            // accepting 'published' as active for simplicity if UI uses that term
            if (draw.status !== 'active') return res.status(400).json({ error: 'Draw is not active' });
        }
        if (now > endDate) return res.status(400).json({ error: 'Draw has ended' });

        const sql = `INSERT INTO entries (draw_id, customer_id, customer_email, customer_name) VALUES (?, ?, ?, ?)`;
        db.run(sql, [draw_id, customer_id, customer_email, customer_name], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'You have already entered this draw.' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, entry_id: this.lastID });
        });
    });
});


// 3. Automated Winner Selection
// Triggered manually for MVP demo purposes, but designed to be automated
app.post('/api/draws/:id/pick-winners', (req, res) => {
    const drawId = req.params.id;

    // 1. validate draw
    db.get('SELECT * FROM draws WHERE id = ?', [drawId], (err, draw) => {
        if (err || !draw) return res.status(404).json({ error: 'Draw not found' });
        if (draw.status === 'completed') return res.status(400).json({ error: 'Winners already picked' });

        // 2. get all entries
        db.all('SELECT id FROM entries WHERE draw_id = ?', [drawId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            if (rows.length === 0) return res.status(400).json({ error: 'No entries to pick from' });

            // 3. Secure Random Selection
            // Fisher-Yates shuffle with crypto.randomInt for fairness
            const shuffled = [...rows];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = crypto.randomInt(0, i + 1);
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            // Pick 1 primary and up to 10 reserves
            const primary = shuffled[0];
            const reserves = shuffled.slice(1, 11);

            // 4. Store winners
            db.serialize(() => {
                const stmt = db.prepare('INSERT INTO winners (draw_id, entry_id, type, rank) VALUES (?, ?, ?, ?)');

                stmt.run(drawId, primary.id, 'primary', 1);

                reserves.forEach((entry, index) => {
                    stmt.run(drawId, entry.id, 'reserve', index + 1);
                });

                stmt.finalize();

                // Update draw status
                // Update draw status
                db.run('UPDATE draws SET status = "completed" WHERE id = ?', [drawId]);

                logAudit('PICK_WINNERS', {
                    drawId,
                    winnerCount: 1 + reserves.length,
                    poolSize: rows.length,
                    method: 'Fisher-Yates Shuffle (Crypto Secure)',
                    timestamp: new Date().toISOString()
                }, 'system');

                res.json({ success: true, primary_winner_entry_id: primary.id, reserve_count: reserves.length });
            });
        });
    });
});

// Get Entries for a draw
app.get('/api/draws/:id/entries', (req, res) => {
    const drawId = req.params.id;
    db.all('SELECT * FROM entries WHERE draw_id = ? ORDER BY entry_time DESC', [drawId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// Get Winners for a draw
app.get('/api/draws/:id/winners', (req, res) => {
    const drawId = req.params.id;
    const sql = `
        SELECT w.*, e.customer_name, e.customer_email 
        FROM winners w 
        JOIN entries e ON w.entry_id = e.id 
        WHERE w.draw_id = ?
        ORDER BY w.rank ASC
    `;
    db.all(sql, [drawId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// Get Audit Logs
app.get('/api/audit-logs', (req, res) => {
    db.all('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
