import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';

const db = new Database('gym.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    duration TEXT NOT NULL,
    features TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS trainers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    experience TEXT NOT NULL,
    specialization TEXT NOT NULL,
    photoUrl TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageUrl TEXT NOT NULL,
    title TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert initial data if empty
const membershipsCount = db.prepare('SELECT COUNT(*) as count FROM memberships').get() as { count: number };
if (membershipsCount.count === 0) {
  const insertMembership = db.prepare('INSERT INTO memberships (name, price, duration, features) VALUES (?, ?, ?, ?)');
  insertMembership.run('Basic', '$29', '1 Month', JSON.stringify(['Access to gym equipment', 'Locker room access', 'Free WiFi']));
  insertMembership.run('Standard', '$49', '1 Month', JSON.stringify(['Access to gym equipment', 'Locker room access', 'Free WiFi', 'Group classes', '1 PT session/month']));
  insertMembership.run('Premium', '$89', '1 Month', JSON.stringify(['Access to gym equipment', 'Locker room access', 'Free WiFi', 'Group classes', 'Unlimited PT sessions', 'Sauna access']));
}

const trainersCount = db.prepare('SELECT COUNT(*) as count FROM trainers').get() as { count: number };
if (trainersCount.count === 0) {
  const insertTrainer = db.prepare('INSERT INTO trainers (name, experience, specialization, photoUrl) VALUES (?, ?, ?, ?)');
  insertTrainer.run('John Doe', '5 Years', 'Bodybuilding', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=500&q=80');
  insertTrainer.run('Jane Smith', '3 Years', 'Yoga & Pilates', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80');
  insertTrainer.run('Mike Johnson', '7 Years', 'CrossFit', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80');
}

const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery').get() as { count: number };
if (galleryCount.count === 0) {
  const insertGallery = db.prepare('INSERT INTO gallery (imageUrl, title) VALUES (?, ?)');
  insertGallery.run('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', 'Main Workout Area');
  insertGallery.run('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80', 'Cardio Section');
  insertGallery.run('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', 'Free Weights');
  insertGallery.run('https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', 'Yoga Studio');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Memberships
  app.get('/api/memberships', (req, res) => {
    const memberships = db.prepare('SELECT * FROM memberships').all();
    res.json(memberships.map((m: any) => ({ ...m, features: JSON.parse(m.features) })));
  });
  
  app.post('/api/memberships', (req, res) => {
    const { name, price, duration, features } = req.body;
    const result = db.prepare('INSERT INTO memberships (name, price, duration, features) VALUES (?, ?, ?, ?)').run(name, price, duration, JSON.stringify(features));
    res.json({ id: result.lastInsertRowid, name, price, duration, features });
  });
  
  app.put('/api/memberships/:id', (req, res) => {
    const { name, price, duration, features } = req.body;
    db.prepare('UPDATE memberships SET name = ?, price = ?, duration = ?, features = ? WHERE id = ?').run(name, price, duration, JSON.stringify(features), req.params.id);
    res.json({ success: true });
  });
  
  app.delete('/api/memberships/:id', (req, res) => {
    db.prepare('DELETE FROM memberships WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Trainers
  app.get('/api/trainers', (req, res) => {
    const trainers = db.prepare('SELECT * FROM trainers').all();
    res.json(trainers);
  });
  
  app.post('/api/trainers', (req, res) => {
    const { name, experience, specialization, photoUrl } = req.body;
    const result = db.prepare('INSERT INTO trainers (name, experience, specialization, photoUrl) VALUES (?, ?, ?, ?)').run(name, experience, specialization, photoUrl);
    res.json({ id: result.lastInsertRowid, name, experience, specialization, photoUrl });
  });
  
  app.put('/api/trainers/:id', (req, res) => {
    const { name, experience, specialization, photoUrl } = req.body;
    db.prepare('UPDATE trainers SET name = ?, experience = ?, specialization = ?, photoUrl = ? WHERE id = ?').run(name, experience, specialization, photoUrl, req.params.id);
    res.json({ success: true });
  });
  
  app.delete('/api/trainers/:id', (req, res) => {
    db.prepare('DELETE FROM trainers WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Gallery
  app.get('/api/gallery', (req, res) => {
    const gallery = db.prepare('SELECT * FROM gallery').all();
    res.json(gallery);
  });
  
  app.post('/api/gallery', (req, res) => {
    const { imageUrl, title } = req.body;
    const result = db.prepare('INSERT INTO gallery (imageUrl, title) VALUES (?, ?)').run(imageUrl, title);
    res.json({ id: result.lastInsertRowid, imageUrl, title });
  });
  
  app.delete('/api/gallery/:id', (req, res) => {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Inquiries
  app.get('/api/inquiries', (req, res) => {
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY createdAt DESC').all();
    res.json(inquiries);
  });
  
  app.post('/api/inquiries', (req, res) => {
    const { name, phone, message } = req.body;
    const result = db.prepare('INSERT INTO inquiries (name, phone, message) VALUES (?, ?, ?)').run(name, phone, message);
    res.json({ id: result.lastInsertRowid, name, phone, message });
  });

  // Admin Auth (Simple hardcoded for demo)
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
      res.json({ token: 'demo-admin-token' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
