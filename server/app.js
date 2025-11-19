const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./src/routes/analyzeRoutes');
const errorHandler = require('./src/middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:5173'
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', analyzeRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Query Optimizer API!');
});

// Error Handler
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // Export for testing