import { useEffect, useState } from 'react';

// Note: this calls a RELATIVE path, not a hardcoded host/port.
// In production, nginx (the reverse proxy) intercepts requests to /api/*
// and forwards them to the backend container. The frontend never needs
// to know the backend's address.
const API_BASE = '/api';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      setError('');
      const res = await fetch(`${API_BASE}/items`);
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError('Could not reach the backend API. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItem.trim() }),
      });
      if (!res.ok) throw new Error('Failed to add item');
      setNewItem('');
      fetchItems();
    } catch (err) {
      setError('Could not add item.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>📦 Multi-Service Docker App</h1>
      <p style={styles.subtitle}>
        React frontend → Nginx reverse proxy → Node.js backend → PostgreSQL
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new item..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {loading ? (
        <p>Loading items...</p>
      ) : (
        <ul style={styles.list}>
          {items.map((item) => (
            <li key={item.id} style={styles.listItem}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '60px auto',
    fontFamily: 'system-ui, sans-serif',
    textAlign: 'center',
  },
  subtitle: { color: '#666', fontSize: 14, marginBottom: 24 },
  form: { display: 'flex', gap: 8, marginBottom: 20 },
  input: { flex: 1, padding: '8px 12px', fontSize: 14 },
  button: { padding: '8px 16px', cursor: 'pointer' },
  error: { color: '#c0392b' },
  list: { listStyle: 'none', padding: 0, textAlign: 'left' },
  listItem: {
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: 6,
    marginBottom: 8,
  },
};

export default App;
