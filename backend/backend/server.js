const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check - used by docker-compose healthchecks and manual debugging
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'backend' });
});

// Fetch all items from the database
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err.message);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Add a new item
app.post('/api/items', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING *',
      [name.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding item:', err.message);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
