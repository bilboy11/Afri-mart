// API server for Afri-cart
// Run: npm run server

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet');
const Database = require('better-sqlite3');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '1mb' }));

// Dev-friendly CORS (frontend runs on :8080)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

function ensureDataDir() {
  const dir = path.join(__dirname, 'data');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function openDb() {
  const dir = ensureDataDir();
  const dbPath = path.join(dir, 'africart.sqlite');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  return db;
}

const db = openDb();

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function hashPassword(password) {
  // Minimal password hashing for demo purposes (use bcrypt/argon2 in production)
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = sha256Hex(`${salt}:${password}`);
  return `${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split('$');
  if (!salt || !hash) return false;
  return sha256Hex(`${salt}:${password}`) === hash;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/signup', (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already exists.' });
  }

  const now = new Date().toISOString();
  const passwordHash = hashPassword(password);
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
    .run(name, email, passwordHash, now);

  const user = { id: info.lastInsertRowid, name, email, createdAt: now };
  res.status(201).json({ success: true, user, message: 'Account created.' });
});

// (Optional) login, useful for testing stored accounts
app.post('/api/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const row = db.prepare('SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?').get(email);
  if (!row || !verifyPassword(password, row.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  res.json({ success: true, user: { id: row.id, name: row.name, email: row.email, createdAt: row.created_at } });
});

// Purchase endpoint (kept for existing app flow)
app.post('/api/purchases', (req, res) => {
  const purchase = req.body;
  console.log('Purchase received:', purchase);

  setTimeout(() => {
    res.json({
      success: true,
      orderId: purchase?.id,
      message: 'Order processed successfully'
    });
  }, 300);
});

const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log('POST /api/signup - Create account');
  console.log('POST /api/login  - Login (optional)');
  console.log('POST /api/purchases - Process purchase orders');
});

server.on('error', (err) => {
  console.error('API server error:', err);
});

// Keep the process alive in some dev runners.
process.stdin.resume();
