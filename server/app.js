const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: 'http://localhost:5173' 
};

app.use(cors(corsOptions));
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello from the Query Optimizer API!');
});

app.post('/api/analyze', async (req, res) => {
  const { userQuery } = req.body;
  if (!userQuery) {
    return res.status(400).json({ error: 'Query is required.' });
  }
  try {
    const analysisQuery = `EXPLAIN (FORMAT JSON, ANALYZE) ${userQuery}`;
    const result = await db.query(analysisQuery);
    const queryPlan = result.rows[0];
    res.json(queryPlan);
} catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Failed to analyze query.', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});